const jwt = require('jsonwebtoken')

const signAccessToken = (user) => jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
)

const signRefreshToken = (user) => jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
)

module.exports = { signAccessToken, signRefreshToken }
