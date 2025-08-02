const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IPFS File Storage API',
      version: '1.0.0',
      description: 'A distributed file storage system using IPFS and blockchain technology',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
          },
        },
        File: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'File ID',
            },
            name: {
              type: 'string',
              description: 'File name',
            },
            cids: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'IPFS content identifiers for the file parts',
            },
            owner: {
              type: 'string',
              description: 'File owner username',
            },
            is_private: {
              type: 'boolean',
              description: 'Whether the file is private',
            },
            timestamp: {
              type: 'integer',
              description: 'Creation timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./index.js', './auth/auth.routes.js', './routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
}; 