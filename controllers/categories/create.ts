import { Elysia, t } from 'elysia';
import { categoriesTable, usersFilesTable } from '../../drizzle/schema'
import { createInsertSchema } from "drizzle-typebox"
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq} from "drizzle-orm"

const createCategorySchema = createInsertSchema(categoriesTable)
export const createCategory = (app: Elysia) =>
  app.post('/create', async ({ body }) => {
    const newCategory: typeof categoriesTable.$inferInsert = {
      name: body.name,
      description: body.description,
      fileId: body.fileId
  }
  const userFile = await db.query.usersFilesTable.findFirst({
    where: eq(usersFilesTable.fileId, body.fileId)
  })
  if(!userFile) {
    throw new Error("Forbidden")
  }
  if (userFile.role !== 'admin') {
    throw new Error("Forbidden")
  }
    const createdCategory = await db
      .insert(categoriesTable)
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