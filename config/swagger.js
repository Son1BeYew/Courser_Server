const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AppCourser API",
      version: "1.0.0",
      description: "Tài liệu API cho AppCourser 🚀",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "67012f9c8a7b3d1234abcd56",
            },
            name: {
              type: "string",
              example: "Công nghệ",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
