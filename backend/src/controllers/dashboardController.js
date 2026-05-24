const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { serializeOrder } = require('../utils/serializers')
const { getAnalytics, getInsights } = require('../analytics/analyticsService')

exports.summary = asyncHandler(async (req, res) => {
  const [customers, orders, notifications, analytics, insights] = await Promise.all([
    prisma.customer.count(),
    prisma.order.findMany({ include: { customer: true, items: true, payments: true, invoice: true }, orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({ where: { OR: [{ userId: req.user.id }, { userId: null }] }, orderBy: { createdAt: 'desc' }, take: 10 }),
    getAnalytics(),
    getInsights(),
  ])
  const totalRevenue = orders.reduce((sum, o) => sum + o.payments.reduce((pSum, p) => pSum + Number(p.amount), 0), 0)
  const outstandingDues = orders.reduce((sum, o) => sum + Number(o.outstandingAmount), 0)
  res.json({
    stats: {
      totalCustomers: customers,
      totalOrders: orders.length,
      activeOrders: orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length,
      completedOrders: orders.filter((o) => o.status === 'COMPLETED').length,
      cancelledOrders: orders.filter((o) => o.status === 'CANCELLED').length,
      totalRevenue,
      outstandingDues,
      pendingPayments: outstandingDues,
      overduePayments: orders.filter((o) => o.dueDate && o.dueDate < new Date() && Number(o.outstandingAmount) > 0).reduce((s, o) => s + Number(o.outstandingAmount), 0),
    },
    recentOrders: orders.slice(0, 8).map(serializeOrder),
    notifications,
    analytics,
    insights,
  })
})
