const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const prisma = require('../config/prisma')

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const invoiceNumber = () => `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

const generateInvoice = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: true, items: true, payments: true },
  })
  if (!order) throw new Error('Order not found')

  const existing = await prisma.invoice.findUnique({ where: { orderId } })
  if (existing) return existing

  const dir = path.resolve(process.cwd(), process.env.INVOICE_DIR || 'uploads/invoices')
  ensureDir(dir)
  const number = invoiceNumber()
  const filename = `${number}.pdf`
  const filePath = path.join(dir, filename)
  const publicUrl = `/uploads/invoices/${filename}`

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 })
    const stream = fs.createWriteStream(filePath)
    stream.on('finish', resolve)
    stream.on('error', reject)
    doc.pipe(stream)

    doc.fontSize(24).text('VendorFlow Invoice', { align: 'right' })
    doc.moveDown().fontSize(10).text(`Invoice: ${number}`, { align: 'right' })
    doc.text(`Order: ${order.orderNumber}`, { align: 'right' })
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' })
    doc.moveDown(2)
    doc.fontSize(14).text('Bill To', { underline: true })
    doc.fontSize(11).text(order.customer.name)
    if (order.customer.email) doc.text(order.customer.email)
    if (order.customer.phone) doc.text(order.customer.phone)
    if (order.customer.address || order.customer.city) doc.text([order.customer.address, order.customer.city].filter(Boolean).join(', '))
    doc.moveDown(2)
    doc.fontSize(12).text('Items')
    doc.moveTo(48, doc.y + 6).lineTo(550, doc.y + 6).stroke()
    doc.moveDown()
    order.items.forEach((item) => {
      doc.fontSize(10).text(`${item.name} x ${item.quantity}`, 48, doc.y, { continued: true })
      doc.text(`Rs. ${Number(item.totalPrice).toFixed(2)}`, { align: 'right' })
    })
    doc.moveDown()
    doc.text(`Subtotal: Rs. ${Number(order.subtotal).toFixed(2)}`, { align: 'right' })
    doc.text(`Tax: Rs. ${Number(order.tax).toFixed(2)}`, { align: 'right' })
    doc.fontSize(14).text(`Total: Rs. ${Number(order.total).toFixed(2)}`, { align: 'right' })
    doc.fontSize(11).text(`Outstanding: Rs. ${Number(order.outstandingAmount).toFixed(2)}`, { align: 'right' })
    doc.moveDown(2).fontSize(9).fillColor('#555').text('Thank you for doing business with VendorFlow.', { align: 'center' })
    doc.end()
  })

  return prisma.invoice.create({ data: { invoiceNumber: number, orderId, pdfUrl: publicUrl } })
}

module.exports = { generateInvoice }
