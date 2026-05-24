const money = (value) => Number(value || 0)

const labelStatus = (value) => {
  const map = {
    ACTIVE: 'Active',
    AT_RISK: 'At Risk',
    OVERDUE: 'Overdue',
    PENDING: 'Created',
    PROCESSING: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PAID: 'Paid',
    PARTIAL: 'Partial',
  }
  return map[value] || value
}

const dbOrderStatus = (value = 'PENDING') => ({
  Created: 'PENDING',
  Pending: 'PENDING',
  Confirmed: 'PROCESSING',
  Confirm: 'PROCESSING',
  Production: 'PROCESSING',
  Dispatch: 'PROCESSING',
  Processing: 'PROCESSING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
})[value] || value.toUpperCase()

const dbCustomerStatus = (value = 'ACTIVE') => ({
  Active: 'ACTIVE',
  'At Risk': 'AT_RISK',
  Overdue: 'OVERDUE',
})[value] || value.toUpperCase()

const serializeCustomer = (c) => ({
  ...c,
  status: labelStatus(c.status),
  totalPaid: money(c.totalPaid),
  outstandingAmount: money(c.outstandingAmount),
  riskScore: Math.max(20, Math.min(100, 100 - Math.round(money(c.outstandingAmount) / 1000))),
})

const serializeOrder = (o) => {
  const paidAmount = (o.payments || []).filter((p) => p.paymentStatus === 'PAID' || p.paymentStatus === 'PARTIAL')
    .reduce((sum, p) => sum + money(p.amount), 0)
  const firstItem = o.items?.[0]
  return {
    ...o,
    status: labelStatus(o.status),
    subtotal: money(o.subtotal),
    tax: money(o.tax),
    total: money(o.total),
    amount: money(o.total),
    outstandingAmount: money(o.outstandingAmount),
    dueDate: o.dueDate || o.payments?.[0]?.dueDate || null,
    product: firstItem?.name || 'Order items',
    payment: { paidAmount },
    invoiceUrl: o.invoice?.pdfUrl,
    items: o.items?.map((i) => ({ ...i, unitPrice: money(i.unitPrice), totalPrice: money(i.totalPrice) })) || [],
  }
}

const serializePayment = (p) => {
  const amount = money(p.order?.total || p.amount)
  const paidAmount = (p.paymentStatus === 'PAID' || p.paymentStatus === 'PARTIAL') ? money(p.amount) : 0
  const due = p.dueDate ? new Date(p.dueDate) : null
  const daysLeft = due ? Math.ceil((due - new Date()) / 86400000) : null
  return {
    ...p,
    amount,
    paidAmount,
    status: labelStatus(p.paymentStatus),
    paidDate: p.paidAt,
    daysLeft,
    customer: p.order?.customer,
  }
}

module.exports = { money, labelStatus, dbOrderStatus, dbCustomerStatus, serializeCustomer, serializeOrder, serializePayment }
