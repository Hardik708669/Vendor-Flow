const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const controller = require('../controllers/authController')
const { validate } = require('../middleware/errorMiddleware')
const { registerRules, loginRules } = require('../validations/authValidation')

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a user
 */
router.post('/register', registerRules, validate, controller.register)
router.post('/login', loginRules, validate, controller.login)
router.get('/me', auth, controller.me)
router.post('/refresh', controller.refresh)
router.post('/logout', auth, controller.logout)

module.exports = router
