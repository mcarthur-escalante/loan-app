import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from '.';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Loan Application Processing Service',
  description:
    'Simple microservice that manages loan applications, including submission, status checks, and admin management.',
  version: '0.0.1',
  baseUrl: `http://localhost:${process.env.PORT || 3000}/api`,
  docsUrl: 'https://github.com/mcarthur-escalante/loan-app',
});
