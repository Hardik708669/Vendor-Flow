const router = require('express').Router()
const controller = require('../controllers/paymentController')

router.get('/', controller.list)
router.get('/export', controller.exportCsv)
router.put('/:id/status', controller.record)
router.post('/:id/record', controller.record)
router.get('/order/:orderId/history', controller.history)

module.exports = router
