import { Elysia, t } from 'elysia';
import { categories } from '../../drizzle/schema/schema'
import { createInsertSchema } from "drizzle-typebox"
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';

const createCategorySchema = createInsertSchema(categories)
export const createCategory = (app: Elysia) =>
  app.post('/create', async ({ body, isAdmin }) => {
    const newCategory: typeof categories.$inferInsert = {
      name: body.name,
      description: body.description,
      fileId: body.fileId
  }
    const createdCategory = await db
      .insert(categories)
      .values(newCategory)
      .returning()
    
    const res: GenericResponseInterface = {
      success: true,
      message: `Create category ${createdCategory[0].name} successfully!`,
      data: createdCategory
    }
    return res
  }, {
    body: t.Omit(createCategorySchema, ['id', 'createdAt', 'updatedAt']),
});