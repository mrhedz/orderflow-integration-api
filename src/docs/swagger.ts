import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrderFlow Integration Hub API',
      version: '1.0.0',
      description:
        'API for receiving, processing, retrying, and monitoring order integrations with external systems.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        OrderItemInput: {
          type: 'object',
          properties: {
            sku: { type: 'string', example: 'SKU-001' },
            name: { type: 'string', example: 'Teclado mecánico' },
            quantity: { type: 'integer', example: 1 },
            price: { type: 'number', example: 1299 },
          },
          required: ['sku', 'name', 'quantity', 'price'],
        },
        OrderWebhookInput: {
          type: 'object',
          properties: {
            source: { type: 'string', example: 'web-store' },
            customer: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@example.com' },
              },
              required: ['name', 'email'],
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItemInput',
              },
            },
            total: { type: 'number', example: 1299 },
            currency: { type: 'string', example: 'MXN' },
          },
          required: ['source', 'customer', 'items', 'total', 'currency'],
        },
        OrderSummaryResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            correlationId: { type: 'string', example: 'uuid' },
            status: {
              type: 'string',
              example: 'SENT',
              enum: ['RECEIVED', 'PROCESSING', 'SENT', 'FAILED', 'RETRYING'],
            },
          },
        },
        MetricsSummary: {
          type: 'object',
          properties: {
            totalOrders: { type: 'integer', example: 3 },
            sent: { type: 'integer', example: 2 },
            failed: { type: 'integer', example: 1 },
            processing: { type: 'integer', example: 0 },
            retrying: { type: 'integer', example: 0 },
            received: { type: 'integer', example: 0 },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation error' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});