require('dotenv').config()
const bcrypt = require('bcrypt')
const prisma = require('../src/config/prisma')
const { generateInvoice } = require('../src/invoices/invoiceService')
const { refreshCustomerTotals } = require('../src/services/orderTotals')

const main = async () => {
  const password = await bcrypt.hash('Admin@12345', 12)
  await prisma.user.upsert({
    where: { email: 'admin@vendorflow.test' },
    update: {},
    create: { name: 'VendorFlow Admin', email: 'admin@vendorflow.test', username: 'admin', password, role: 'ADMIN' },
  })
  await prisma.user.upsert({
    where: { email: 'staff@vendorflow.test' },
    update: {},
    create: { name: 'VendorFlow Staff', email: 'staff@vendorflow.test', username: 'staff', password: await bcrypt.hash('Staff@12345', 12), role: 'STAFF' },
  })

  const acme = await prisma.customer.upsert({
    where: { email: 'purchase@acme.example' },
    update: {},
    create: { name: 'Acme Retail Mart', email: 'purchase@acme.example', phone: '+91 98765 43210', city: 'Mumbai', contactPerson: 'Amit Sharma' },
  })
  const nova = await prisma.customer.upsert({
    where: { email: 'ops@novatraders.example' },
    update: {},
    create: { name: 'Nova Traders', email: 'ops@novatraders.example', phone: '+91 91234 56789', city: 'Pune', contactPerson: 'Neha Rao' },
  })

  await prisma.product.upsert({
    where: { sku: 'VF-STEEL-PIPE' },
    update: {},
    create: { name: 'Steel Pipes', sku: 'VF-STEEL-PIPE', price: 1500, stock: 18, category: 'Industrial' },
  })
  await prisma.product.upsert({
    where: { sku: 'VF-COPPER-WIRE' },
    update: {},
    create: { name: 'Copper Wire Bundle', sku: 'VF-COPPER-WIRE', price: 850, stock: 4, category: 'Electrical' },
  })

  const existing = await prisma.order.count()
  if (existing === 0) {
    const acmeDueDate = new Date('2026-05-18T10:00:00+05:30')
    const acmePaidAt = new Date('2026-05-18T12:30:00+05:30')
    const novaDueDate = new Date('2026-05-19T10:00:00+05:30')
    const order = await prisma.order.create({
      data: {
        orderNumber: 'VF-2026-000001',
        customerId: acme.id,
        status: 'PROCESSING',
        subtotal: 15000,
        tax: 2700,
        total: 17700,
        outstandingAmount: 9700,
        dueDate: acmeDueDate,
        items: { create: [{ name: 'Steel Pipes', quantity: 10, unitPrice: 1500, totalPrice: 15000 }] },
        payments: { create: [{ amount: 8000, paymentMethod: 'Bank Transfer', paymentStatus: 'PARTIAL', paidAt: acmePaidAt, dueDate: acmeDueDate }] },
      },
    })
    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'VF-2026-000002',
        customerId: nova.id,
        status: 'PENDING',
        subtotal: 8500,
        tax: 1530,
        total: 10030,
        outstandingAmount: 10030,
        dueDate: novaDueDate,
        items: { create: [{ name: 'Copper Wire Bundle', quantity: 10, unitPrice: 850, totalPrice: 8500 }] },
        payments: { create: [{ amount: 0, paymentStatus: 'PENDING', dueDate: novaDueDate }] },
      },
    })
    await generateInvoice(order.id)
    await generateInvoice(order2.id)
    await refreshCustomerTotals(acme.id)
    await refreshCustomerTotals(nova.id)
  }

  await prisma.notification.createMany({
    data: [
      { title: 'Welcome to VendorFlow', message: 'Your backend is ready with seeded customers, orders, payments, and invoices.', type: 'SUCCESS' },
      { title: 'Low Stock Alert', message: 'Copper Wire Bundle stock is critically low.', type: 'WARNING' },
    ],
    skipDuplicates: true,
  })

  console.log('Seed complete')
  console.log('Admin: admin@vendorflow.test / Admin@12345')
  console.log('Staff: staff@vendorflow.test / Staff@12345')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
