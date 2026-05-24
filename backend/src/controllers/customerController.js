const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { dbCustomerStatus, serializeCustomer } = require('../utils/serializers')

exports.list = asyncHandler(async (req, res) => {
  const { search = '', status, page = 1, limit = 100 } = req.query
  const where = {
    ...(status && status !== 'All' ? { status: dbCustomerStatus(status) } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { phone: { contains: search, mode: 'insensitive' } }] } : {}),
  }
  const rows = await prisma.customer.findMany({
    where,
    include: { orders: { select: { id: true, total: true, status: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  })
  res.json(rows.map(serializeCustomer))
})

exports.get = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: { orders: { include: { payments: true, invoice: true, items: true } } },
  })
  if (!customer) throw new AppError('Customer not found', 404)
  res.json(serializeCustomer(customer))
})

exports.create = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.create({
    data: {
      name: req.body.name,
      email: req.body.email || null,
      phone: req.body.phone || null,
      address: req.body.address || null,
      city: req.body.city || null,
      notes: req.body.notes || null,
      contactPerson: req.body.contactPerson || null,
    },
  })
  res.status(201).json(serializeCustomer(customer))
})

exports.update = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      notes: req.body.notes,
      contactPerson: req.body.contactPerson,
      status: req.body.status ? dbCustomerStatus(req.body.status) : undefined,
    },
  })
  res.json(serializeCustomer(customer))
})

exports.remove = asyncHandler(async (req, res) => {
  await prisma.customer.delete({ where: { id: req.params.id } })
  res.status(204).send()
})
