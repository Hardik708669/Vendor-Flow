const prisma = require('../config/prisma')
const { notifyAll } = require('../notifications/notificationService')

const markOverduePayments = async () => {
  const overdueOrders = await prisma.order.findMany({
    where: { dueDate: { lt: new Date() }, outstandingAmount: { gt: 0 } },
    include: { customer: true },
  })
  for (const order of overdueOrders) {
    await prisma.payment.updateMany({
      where: { orderId: order.id, amount: 0 },
      data: { paymentStatus: 'OVERDUE' },
    })
    await prisma.customer.update({ where: { id: order.customerId }, data: { status: 'OVERDUE' } })
  }
  if (overdueOrders.length) {
    await notifyAll({
      title: 'Overdue Payments Detected',
      message: `${overdueOrders.length} order(s) now have overdue payments.`,
      type: 'DANGER',
    })
  }
  return overdueOrders.length
}

module.exports = { markOverduePayments }
