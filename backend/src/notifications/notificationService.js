const prisma = require('../config/prisma')

const notifyAll = async ({ title, message, type = 'INFO' }) => {
  const users = await prisma.user.findMany({ select: { id: true } })
  if (!users.length) {
    return prisma.notification.create({ data: { title, message, type } })
  }
  return prisma.notification.createMany({
    data: users.map((u) => ({ userId: u.id, title, message, type })),
  })
}

module.exports = { notifyAll }
