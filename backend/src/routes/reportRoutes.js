const router = require('express').Router()
const controller = require('../controllers/reportController')

router.get('/analytics', controller.analytics)
router.get('/insights', controller.insights)
router.get('/export/pdf', controller.exportPdf)

module.exports = router
