const app = require('./app')
const prisma = require('./config/prisma')

const port = process.env.PORT || 5000

const server = app.listen(port, () => {
  console.log(`VendorFlow API running on port ${port}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
})
