const swaggerJsdoc = require('swagger-jsdoc')

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VendorFlow API',
      version: '1.0.0',
      description: 'REST API for VendorFlow order lifecycle and payment tracking.',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
})
