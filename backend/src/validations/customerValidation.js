const { body } = require('express-validator')

exports.customerRules = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
]
