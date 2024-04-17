import { Elysia } from 'elysia';
import { createCategory } from './create'

export const filesController = new Elysia({ prefix: '/categories'})
    .use(createCategory)
;