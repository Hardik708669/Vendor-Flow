const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() })
  }
  next()
}

const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  if (process.env.NODE_ENV !== 'test') {
    console.error(err)
  }
  res.status(statusCode).json({
    message: err.isOperational ? err.message : (statusCode === 500 ? 'Internal server error' : err.message),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
}

module.exports = { validate, notFound, errorHandler }
