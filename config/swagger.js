
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Courser API',
      description: 'API for Courser application',
      contact: {
        name: 'Amazing Developer'
      },
      servers: ['http://localhost:5000']
    },
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your bearer token in the format: Bearer <token>'
      },
      XAuthToken: {
        type: 'apiKey',
        name: 'x-auth-token',
        in: 'header',
        description: 'Enter your token directly (without Bearer prefix)'
      }
    },
    security: [
      {
        Bearer: []
      },
      {
        XAuthToken: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
