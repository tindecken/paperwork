import { Elysia } from 'elysia';
import { createCategory } from './create'
import { getCategoriesByFileId } from './getByFileId'
import { updateCategoriesByPaperworkId } from './updateCategoriesByPaperworkId'

export const categoriesController = new Elysia({ prefix: '/categories'})
    .use(createCategory)
    .use(getCategoriesByFileId)
    .use(updateCategoriesByPaperworkId)
;