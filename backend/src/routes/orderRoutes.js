const router = require('express').Router()
const controller = require('../controllers/orderController')
const { validate } = require('../middleware/errorMiddleware')
const { orderRules } = require('../validations/orderValidation')

router.get('/', controller.list)
router.post('/', orderRules, validate, controller.create)
router.get('/:id', controller.get)
router.put('/:id', controller.update)
router.put('/:id/status', controller.updateStatus)
router.delete('/:id', controller.remove)

module.exports = router
