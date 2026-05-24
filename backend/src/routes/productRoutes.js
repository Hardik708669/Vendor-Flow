const router = require('express').Router()
const controller = require('../controllers/productController')
const { validate } = require('../middleware/errorMiddleware')
const { productRules } = require('../validations/productValidation')

router.get('/', controller.list)
router.post('/', productRules, validate, controller.create)
router.put('/:id', productRules, validate, controller.update)
router.delete('/:id', controller.remove)

module.exports = router
