const { body } = require('express-validator')

exports.orderRules = [
  body('customerId').notEmpty().withMessage('Customer is required'),
  body('items').optional().isArray(),
  body('product').if(body('items').not().exists()).trim().notEmpty().withMessage('Product is required'),
]
