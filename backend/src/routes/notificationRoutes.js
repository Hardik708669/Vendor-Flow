const router = require('express').Router()
const controller = require('../controllers/notificationController')

router.get('/', controller.list)
router.patch('/read-all', controller.markAllRead)
router.patch('/:id/read', controller.markRead)

module.exports = router
