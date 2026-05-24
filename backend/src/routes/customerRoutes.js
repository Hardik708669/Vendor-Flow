const router = require('express').Router()
const controller = require('../controllers/customerController')
const { validate } = require('../middleware/errorMiddleware')
const { customerRules } = require('../validations/customerValidation')

router.get('/', controller.list)
router.post('/', customerRules, validate, controller.create)
router.get('/:id', controller.get)
router.put('/:id', customerRules, validate, controller.update)
router.delete('/:id', controller.remove)

module.exports = router
