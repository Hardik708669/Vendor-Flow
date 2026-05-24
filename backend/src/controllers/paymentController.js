const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { serializePayment } = require('../utils/serializers')
const { refreshOrderOutstanding } = require('../services/orderTotals')
const { notifyAll } = require('../notifications/notificationService')

const include = { order: { include: { customer: true } } }

const statusFor = (paid, total, dueDate) => {
  if (paid >= total) return 'PAID'
  if (paid > 0) return 'PARTIAL'
  if (dueDate && new Date(dueDate) < new Date()) return 'OVERDUE'
  return 'PENDING'
}

const getPaymentRows = async () => {
  const orders = await prisma.order.findMany({
    include: { customer: true, payments: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })
  return orders.map((order) => {
    const paid = order.payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const dueDate = order.dueDate || order.payments[0]?.dueDate
    return {
      id: order.payments[0]?.id || order.id,
      orderId: order.id,
      order: { id: order.id, orderNumber: order.orderNumber, customer: order.customer, total: order.total },
      amount: paid,
      paymentStatus: statusFor(paid, Number(order.total), dueDate),
      paidAt: order.payments.find((p) => p.paidAt)?.paidAt || null,
      dueDate,
      createdAt: order.createdAt,
    }
  })
}

exports.list = asyncHandler(async (req, res) => {
  const rows = await getPaymentRows()
  res.json(rows.map(serializePayment))
})

exports.exportCsv = asyncHandler(async (req, res) => {
  const rows = (await getPaymentRows()).map(serializePayment)
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const headers = ['Payment ID', 'Order', 'Customer', 'Amount', 'Paid Amount', 'Outstanding', 'Due Date', 'Paid On', 'Status']
  const lines = rows.map((p) => [
    p.id,
    p.order?.orderNumber,
    p.customer?.name,
    p.amount,
    p.paidAmount,
    Math.max(Number(p.amount) - Number(p.paidAmount || 0), 0),
    p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-IN') : '',
    p.paidDate ? new Date(p.paidDate).toLocaleDateString('en-IN') : '',
    p.status,
  ].map(escape).join(','))

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="vendorflow-payments-${Date.now()}.csv"`)
  res.send([headers.map(escape).join(','), ...lines].join('\n'))
})

exports.record = asyncHandler(async (req, res) => {
  const marker = await prisma.payment.findUnique({ where: { id: req.params.id }, include })
  if (!marker) throw new AppError('Payment record not found', 404)

  const amountToApply = Number(req.body.amountToApply || req.body.amount || 0)
  if (amountToApply <= 0) throw new AppError('Payment amount must be greater than zero', 422)

  const order = await prisma.order.findUnique({ where: { id: marker.orderId }, include: { payments: true, customer: true } })
  const alreadyPaid = order.payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const remaining = Math.max(Number(order.total) - alreadyPaid, 0)
  const applied = Math.min(amountToApply, remaining)
  if (applied <= 0) throw new AppError('Order is already paid', 422)

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: applied,
      paymentMethod: req.body.paymentMethod || 'Manual',
      paymentStatus: applied >= remaining ? 'PAID' : 'PARTIAL',
      paidAt: new Date(),
      dueDate: order.dueDate,
    },
    include,
  })
  await refreshOrderOutstanding(order.id)
  await notifyAll({ title: 'Payment Received', message: `Received Rs. ${applied.toFixed(2)} from ${order.customer.name}.`, type: 'SUCCESS' })

  const paidNow = alreadyPaid + applied
  res.json(serializePayment({ ...payment, order: { ...payment.order, total: order.total }, amount: paidNow, paymentStatus: statusFor(paidNow, Number(order.total), order.dueDate) }))
})

exports.history = asyncHandler(async (req, res) => {
  const rows = await prisma.payment.findMany({ where: { orderId: req.params.orderId }, include, orderBy: { createdAt: 'desc' } })
  res.json(rows.map(serializePayment))
})
