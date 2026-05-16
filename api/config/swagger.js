// config/swagger.js
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for your E-commerce application",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // 🔥 مهم جدًا (علشان انت شغال modules)
  apis: ["./modules/**/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
