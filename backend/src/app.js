require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const auth = require('./middleware/authMiddleware')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'],
  credentials: true,
}))
app.use(compression())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }))
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'VendorFlow API' }))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/dashboard', auth, require('./routes/dashboardRoutes'))
app.use('/api/customers', auth, require('./routes/customerRoutes'))
app.use('/api/products', auth, require('./routes/productRoutes'))
app.use('/api/orders', auth, require('./routes/orderRoutes'))
app.use('/api/payments', auth, require('./routes/paymentRoutes'))
app.use('/api/reports', auth, require('./routes/reportRoutes'))
app.use('/api/notifications', auth, require('./routes/notificationRoutes'))
app.use('/api/invoices', auth, require('./routes/invoiceRoutes'))

app.use(notFound)
app.use(errorHandler)

module.exports = app
