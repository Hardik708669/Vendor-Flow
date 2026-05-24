const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')
const { signAccessToken, signRefreshToken } = require('../utils/tokens')

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, username: user.username, role: user.role })

exports.register = asyncHandler(async (req, res) => {
  const { name, email, username, password, role } = req.body
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, ...(username ? [{ username }] : [])] } })
  if (existing) throw new AppError('Email or username already exists', 409)

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, username, password: hashed, role: role === 'Admin' || role === 'ADMIN' ? 'ADMIN' : 'STAFF' },
  })
  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })
  res.status(201).json({ user: publicUser(user), accessToken, refreshToken })
})

exports.login = asyncHandler(async (req, res) => {
  const { identifier, email, password } = req.body
  const loginId = identifier || email
  const user = await prisma.user.findFirst({ where: { OR: [{ email: loginId }, { username: loginId }] } })
  if (!user || !(await bcrypt.compare(password, user.password))) throw new AppError('Invalid credentials', 401)

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })
  res.json({ user: publicUser(user), accessToken, refreshToken })
})

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user })
})

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new AppError('Refresh token required', 400)
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  if (!user || user.refreshToken !== refreshToken) throw new AppError('Invalid refresh token', 401)
  const accessToken = signAccessToken(user)
  res.json({ accessToken })
})

exports.logout = asyncHandler(async (req, res) => {
  await prisma.user.update({ where: { id: req.user.id }, data: { refreshToken: null } })
  res.status(204).send()
})
