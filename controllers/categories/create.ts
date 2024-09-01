import { Elysia, t } from 'elysia';
import { categoriesTable, filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and} from "drizzle-orm"
import { ulid } from 'ulid'

export const createCategory = (app: Elysia) =>
  app.post('/create', async ({ body, set }) => {
    var existedFile = await db.select().from(filesTable).where(
      and(
        eq(filesTable.id, body.fileId),
        eq(filesTable.isDeleted, 0)
      )
    )
    if(!existedFile) {
      set.status = 404
      const res: GenericResponseInterface = {
        success: false,
        message: `File not found!`,
        data: null
      }
      return res
    }
    const newCategory: typeof categoriesTable.$inferInsert = {
      id: ulid(),
      name: body.name,
      description: body.description,
      fileId: body.fileId
    }
    const userFile = await db.query.usersFilesTable.findFirst({
      where: eq(usersFilesTable.fileId, body.fileId)
    })
    if(!userFile) {
      set.status = 404
      const res: GenericResponseInterface = {
        success: false,
        message: `You are not allowed to create category!`,
        data: null
      }
      return res
    }
    if (userFile.role !== 'admin') {
      set.status = 403
      const res: GenericResponseInterface = {
        success: false,
        message: `You are not allowed to create category!`,
        data: null
      }
      return res
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
      body: t.Object({
        fileId: t.String(),
        name: t.String(),
        description: t.Optional(t.String())
      }),
});