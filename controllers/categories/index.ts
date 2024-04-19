import { Elysia } from 'elysia';
import { createCategory } from './create'

export const categoriesController = new Elysia({ prefix: '/categories'})
    .use(createCategory)
;