const prisma = require('../config/prisma')

const refreshCustomerTotals = async (customerId) => {
  const orders = await prisma.order.findMany({
    where: { customerId },
    include: { payments: true },
  })
  const totalPaid = orders.reduce((sum, o) => sum + o.payments.reduce((pSum, p) => pSum + Number(p.amount), 0), 0)
  const outstandingAmount = orders.reduce((sum, o) => sum + Number(o.outstandingAmount), 0)
  const status = outstandingAmount > 0 ? 'AT_RISK' : 'ACTIVE'
  return prisma.customer.update({
    where: { id: customerId },
    data: { totalPaid, outstandingAmount, status },
  })
}

const refreshOrderOutstanding = async (orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } })
  const paid = order.payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const outstanding = Math.max(Number(order.total) - paid, 0)
  const status = outstanding === 0 ? 'COMPLETED' : order.status
  const updated = await prisma.order.update({ where: { id: orderId }, data: { outstandingAmount: outstanding, status } })
  await refreshCustomerTotals(order.customerId)
  return updated
}

module.exports = { refreshCustomerTotals, refreshOrderOutstanding }
