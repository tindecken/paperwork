import type { Elysia } from 'elysia';

export const createCategory = (app: Elysia) =>
  app.post('/categories/create', async ({ body }) => {
    return body
  });