const request = require('supertest')
const app = require('../src/app')

describe('health', () => {
  test('returns api health', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
