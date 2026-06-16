import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books & Authors API',
      version: '1.0.0',
      description: 'CRUD API for Books and Authors',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Dev server' }],
    components: {
      schemas: {
        Author: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'George Orwell' },
            bio: { type: 'string', nullable: true, example: 'English novelist and essayist.' },
          },
        },
        AuthorInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'George Orwell' },
            bio: { type: 'string', example: 'English novelist and essayist.' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: '1984' },
            year: { type: 'integer', nullable: true, example: 1949 },
            author_id: { type: 'integer', nullable: true, example: 1 },
            author_name: { type: 'string', nullable: true, example: 'George Orwell' },
          },
        },
        BookInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: '1984' },
            year: { type: 'integer', example: 1949 },
            author_id: { type: 'integer', example: 1 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Not found' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
