const router = require('express').Router()
const asyncHandler = require('../utils/asyncHandler')
const { generateInvoice } = require('../invoices/invoiceService')

router.post('/orders/:orderId/generate', asyncHandler(async (req, res) => {
  res.status(201).json(await generateInvoice(req.params.orderId))
}))

module.exports = router
