const prisma = require('../config/prisma')

const monthKey = (date) => date.toLocaleString('en-US', { month: 'short' })

const getAnalytics = async () => {
  const [orders, customers, products] = await Promise.all([
    prisma.order.findMany({ include: { customer: true, payments: true, items: true } }),
    prisma.customer.findMany({ include: { orders: true } }),
    prisma.product.findMany(),
  ])

  const months = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - idx))
    return { date: d, month: monthKey(d), revenue: 0, collected: 0, orders: 0 }
  })

  orders.forEach((order) => {
    const bucket = months.find((m) => m.date.getMonth() === order.createdAt.getMonth() && m.date.getFullYear() === order.createdAt.getFullYear())
    if (bucket) {
      bucket.revenue += Number(order.total)
      bucket.collected += order.payments.reduce((sum, p) => sum + Number(p.amount), 0)
      bucket.orders += 1
    }
  })

  const byCustomer = new Map()
  orders.forEach((order) => {
    const entry = byCustomer.get(order.customerId) || { name: order.customer.name, value: 0, orders: 0 }
    entry.value += Number(order.total)
    entry.orders += 1
    byCustomer.set(order.customerId, entry)
  })
  const maxCustomer = Math.max(...Array.from(byCustomer.values()).map((c) => c.value), 1)

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})
  const labelMap = { PENDING: 'Created', PROCESSING: 'Processing', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }

  return {
    monthlyData: months.map(({ month, revenue, collected, orders }) => ({ month, revenue, collected, orders })),
    topCustomers: Array.from(byCustomer.values()).sort((a, b) => b.value - a.value).slice(0, 5)
      .map((c) => ({ ...c, share: Math.round((c.value / maxCustomer) * 100) })),
    statusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({
      label: labelMap[status] || status,
      count,
      pct: orders.length ? Math.round((count / orders.length) * 100) : 0,
    })),
    lowStock: products.filter((p) => p.stock <= 5),
    overdueCustomers: customers.filter((c) => Number(c.outstandingAmount) > 0),
  }
}

const getInsights = async () => {
  const analytics = await getAnalytics()
  const current = analytics.monthlyData.at(-1)?.revenue || 0
  const previous = analytics.monthlyData.at(-2)?.revenue || 0
  const growth = previous ? Math.round(((current - previous) / previous) * 100) : 0
  const insights = []
  insights.push(`Sales ${growth >= 0 ? 'increased' : 'decreased'} ${Math.abs(growth)}% this month.`)
  analytics.overdueCustomers.slice(0, 3).forEach((c) => insights.push(`${c.name} has outstanding payments of Rs. ${Number(c.outstandingAmount).toFixed(2)}.`))
  analytics.lowStock.slice(0, 3).forEach((p) => insights.push(`${p.name} stock is critically low.`))
  if (analytics.topCustomers[0]) insights.push(`${analytics.topCustomers[0].name} is your highest-value customer.`)
  return insights
}

module.exports = { getAnalytics, getInsights }
