const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')

exports.list = asyncHandler(async (req, res) => {
  const rows = await prisma.notification.findMany({
    where: { OR: [{ userId: req.user.id }, { userId: null }] },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  res.json(rows)
})

exports.markRead = asyncHandler(async (req, res) => {
  const row = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } })
  res.json(row)
})

exports.markAllRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { OR: [{ userId: req.user.id }, { userId: null }] }, data: { isRead: true } })
  res.status(204).send()
})
