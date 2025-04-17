import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
// const swaggerDefinition = {
//   openapi: '3.0.0',  // OpenAPI specification version
//   info: {
//     title: 'Customer Support Ticket System API',  // API title
//     version: '1.0.0',  // API version
//     description: 'API documentation for the Customer Support Ticket System',
//   },
//   servers: [
//     {
//       url: 'http://localhost:5000',  // Server URL
//     },
//   ],
// };

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Customer Support Ticket System API',
    version: '1.0.0',
    description: 'API documentation for the Customer Support Ticket System',
  },
  servers: [
    {
      url: 'http://localhost:5000',
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
  },
};


// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  //apis: ['./src/modules/**/*.ts'], // Path to your API routes
  apis: ['./src/docs/**/*.ts'],

};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  // Set up Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
