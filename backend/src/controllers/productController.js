const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')

const serialize = (p) => ({ ...p, price: Number(p.price) })

exports.list = asyncHandler(async (req, res) => {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(rows.map(serialize))
})

exports.create = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      stock: Number(req.body.stock || 0),
      category: req.body.category,
      description: req.body.description,
    },
  })
  res.status(201).json(serialize(product))
})

exports.update = asyncHandler(async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      stock: req.body.stock === undefined ? undefined : Number(req.body.stock),
      category: req.body.category,
      description: req.body.description,
      status: req.body.status,
    },
  })
  res.json(serialize(product))
})

exports.remove = asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } })
  res.status(204).send()
})
