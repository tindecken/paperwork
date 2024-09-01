import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import {documentsTable, paperworksTable, categoriesTable, type InsertPaperwork, paperworksCategoriesTable} from '../../drizzle/schema.ts'
import { db } from '../../drizzle'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";
import { ulid } from 'ulid'

const createPaperorkSchema = createInsertSchema(paperworksTable)
export const createPaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .post('/create', async ({body, userInfo, set}) => {
      const category = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, body.categoryId),
      })
      if (!category) {
        throw new Error(`Category ${body.categoryId} not found!`)
      }
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!)
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
        const ppw: InsertPaperwork = {
          id: ulid(),
          name: body.name,
          description: body.description,
          issuedAt: body.date,
          price: body.price,
          priceCurrency: body.priceCurrency,
          createdBy: userInfo.userName
        }
        const insertedPaperWork = await tx.insert(paperworksTable).values(ppw).returning()
        // create paperwork-category relationship
        const pwc: typeof paperworksCategoriesTable.$inferInsert = {
          id: ulid(),
          paperworkId: insertedPaperWork[0].id,
          categoryId: body.categoryId,
          createdBy: userInfo.userName
        }
        await tx.insert(paperworksCategoriesTable).values(pwc).returning()
        // create documents for uploaded files
        if (body.files) {
          for (const file of body.files) {
            console.log(`Uploading file: ${file.name}`)
            const fileArrayBuffer = await file.arrayBuffer();
            if (fileArrayBuffer.byteLength === 0) throw new Error(`File ${file.name} is empty!`)
            const blobData = new Uint8Array(fileArrayBuffer);
            const document: typeof documentsTable.$inferInsert = {
              id: ulid(),
              paperworkId: insertedPaperWork[0].id,
              fileSize: file.size,
              fileName: file.name,
              fileBlob: blobData,
              createdBy: userInfo.userName
            }
            await tx
              .insert(documentsTable)
              .values(document)
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
      body: t.Object({
        files: t.Optional(t.Files()),
        categoryId: t.String(),
        name: t.String(),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        price: t.Optional(t.Number()),
        priceCurrency: t.Optional(t.String()),
      })
    })
