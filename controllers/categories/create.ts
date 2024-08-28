import { Elysia, t } from 'elysia';
import { categories, usersFiles } from '../../drizzle/schema'
import { createInsertSchema } from "drizzle-typebox"
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq} from "drizzle-orm"

const createCategorySchema = createInsertSchema(categories)
export const createCategory = (app: Elysia) =>
  app.post('/create', async ({ body }) => {
    const newCategory: typeof categories.$inferInsert = {
      name: body.name,
      description: body.description,
      fileId: body.fileId
  }
  const userFile = await db.query.usersFiles.findFirst({
    where: eq(usersFiles.fileId, body.fileId)
  })
  if(!userFile) {
    throw new Error("Forbidden")
  }
  if (userFile.role !== 'admin') {
    throw new Error("Forbidden")
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