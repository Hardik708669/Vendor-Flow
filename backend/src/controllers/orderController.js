const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { dbOrderStatus, serializeOrder } = require('../utils/serializers')
const { generateInvoice } = require('../invoices/invoiceService')
const { notifyAll } = require('../notifications/notificationService')
const { refreshCustomerTotals } = require('../services/orderTotals')

const nextOrderNumber = () => `VF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

exports.list = asyncHandler(async (req, res) => {
  const rows = await prisma.order.findMany({
    include: { customer: true, items: true, payments: true, invoice: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(rows.map(serializeOrder))
})

exports.get = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { customer: true, items: true, payments: true, invoice: true },
  })
  if (!order) throw new AppError('Order not found', 404)
  res.json(serializeOrder(order))
})

exports.create = asyncHandler(async (req, res) => {
  const items = req.body.items?.length ? req.body.items : [{
    name: req.body.product,
    quantity: Number(req.body.quantity || 1),
    unitPrice: Number(req.body.unitPrice || req.body.amount || 0),
  }]
  const subtotal = items.reduce((sum, i) => sum + Number(i.quantity) * Number(i.unitPrice), 0)
  const taxRate = Number(req.body.gstRate || req.body.taxRate || 0)
  const tax = req.body.tax !== undefined ? Number(req.body.tax) : subtotal * (taxRate / 100)
  const total = req.body.amount !== undefined ? Number(req.body.amount) : subtotal + tax

  const order = await prisma.order.create({
    data: {
      orderNumber: req.body.orderNumber || nextOrderNumber(),
      customerId: req.body.customerId,
      status: dbOrderStatus(req.body.status || 'Created'),
      subtotal,
      tax,
      total,
      outstandingAmount: total,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      items: {
        create: items.map((i) => ({
          productId: i.productId || null,
          name: i.name || i.product || 'Product',
          quantity: Number(i.quantity || 1),
          unitPrice: Number(i.unitPrice || 0),
          totalPrice: Number(i.quantity || 1) * Number(i.unitPrice || 0),
        })),
      },
    },
    include: { customer: true, items: true, payments: true, invoice: true },
  })

  await prisma.payment.create({
    data: { orderId: order.id, amount: 0, paymentStatus: 'PENDING', dueDate: order.dueDate },
  })
  await generateInvoice(order.id)
  await refreshCustomerTotals(order.customerId)
  await notifyAll({ title: 'New Order Created', message: `${order.orderNumber} was created for ${order.customer.name}.`, type: 'INFO' })

  const fresh = await prisma.order.findUnique({ where: { id: order.id }, include: { customer: true, items: true, payments: true, invoice: true } })
  res.status(201).json(serializeOrder(fresh))
})

exports.update = asyncHandler(async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status ? dbOrderStatus(req.body.status) : undefined, dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined },
    include: { customer: true, items: true, payments: true, invoice: true },
  })
  res.json(serializeOrder(order))
})

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: dbOrderStatus(req.body.status) },
    include: { customer: true, items: true, payments: true, invoice: true },
  })
  await notifyAll({ title: 'Order Updated', message: `${order.orderNumber} moved to ${req.body.status}.`, type: order.status === 'COMPLETED' ? 'SUCCESS' : 'INFO' })
  res.json(serializeOrder(order))
})

exports.remove = asyncHandler(async (req, res) => {
  const order = await prisma.order.delete({ where: { id: req.params.id } })
  await refreshCustomerTotals(order.customerId)
  res.status(204).send()
})
