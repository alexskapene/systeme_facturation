import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eTax Solution RDC API',
      version: '1.0.0',
      description:
        "Documentation de l'API du système de facturation électronique conforme aux normes de la RDC",
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Serveur de développement',
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
  },
  apis: ['./src/routes/*.ts'], // Où se trouvent les annotations de documentation
};

export const swaggerSpec = swaggerJSDoc(options);
