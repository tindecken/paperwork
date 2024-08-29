import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import {documentsTable, paperworksTable, categoriesTable} from '../../drizzle/schema.ts'
import { db } from '../../drizzle'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";

const createPaperWorkSchema = createInsertSchema(paperworksTable)
export const createPaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .post('/create/:categoryId', async ({body, params: { categoryId }, userInfo, set}) => {
      const category = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, categoryId)
      })
      if (!category) {
        throw new Error(`Category ${categoryId} not found!`)
      }
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.fileId!)
      if(!isAdminRights) {
        throw new Error("Forbidden")
      }
      if (body.files && body.files.length > 20) {
        set.status = 400
        throw new Error('You can only upload up to 20 files at a time!')
      }
      if (body.files) {
        for (const file of body.files) {
          if (file.size > 1024 * 1024 * 10) {
            throw new Error(`File ${file.name} with file size ${file.size} is greater than 10MB! Please upload a smaller file.`)
          }
        }
      }
      await db.transaction(async (tx) => {
        const ppw: typeof paperworksTable.$inferInsert = {
          categoryId: categoryId,
          name: body.name,
          description: body.description,
          date: body.date,
          price: body.price,
          createdBy: userInfo.userName
        }
        const insertedPaperWork = await tx.insert(paperworksTable).values(ppw).returning()
        // upload files
        if (body.files) {
          for (const file of body.files) {
            const fileArrayBuffer = await file.arrayBuffer();
            if (fileArrayBuffer.byteLength === 0) throw new Error(`File ${file.name} is empty!`)
            const blobData = new Uint8Array(fileArrayBuffer);
            const newDocument: typeof documentsTable.$inferInsert = {
              paperWorkId: insertedPaperWork[0].id,
              fileSize: file.size,
              fileName: file.name,
              fileBlob: blobData,
              createdBy: userInfo.userName
            }
            await tx
              .insert(documentsTable)
              .values(newDocument)
              .returning()
          }
        }
      })
      const res: GenericResponseInterface = {
        success: true,
        message: `Create paper work: ${body.name} successfully!`,
        data: null
      }
      return res
    }, {
      body: t.Omit(t.Composite([createPaperWorkSchema, t.Object({files: t.Optional(t.Files())})]), ['id', 'categoryId', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']),
      params: t.Object({
        categoryId: t.Numeric()
      })
    })