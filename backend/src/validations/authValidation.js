const { body } = require('express-validator')

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

exports.loginRules = [
  body('identifier').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]
