import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import {documentsTable, paperworksTable, categoriesTable, type InsertPaperwork, paperworksCategoriesTable} from '../../drizzle/schema.ts'
import { db } from '../../drizzle'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";
import { ulid } from 'ulid'

export const createPaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .post('/create', async ({body, userInfo, set}) => {
      if (body.name.trim().length == 0) {
        set.status = 400
        throw new Error('Name is required!')
      }
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
      const ppwULID = ulid()
      await db.transaction(async (tx) => {
        const ppw: InsertPaperwork = {
          id: ppwULID,
          name: body.name.trim(),
          description: body.description,
          issuedAt: body.issueAt,
          price: body.price ? parseFloat(body.price) : null,
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
            const fileArrayBuffer = await file.arrayBuffer();
            if (fileArrayBuffer.byteLength === 0) throw new Error(`File ${file.name} is empty!`)
            const blobData = new Uint8Array(fileArrayBuffer);
            const document: typeof documentsTable.$inferInsert = {
              id: ulid(),
              paperworkId: insertedPaperWork[0].id,
              fileSize: file.size,
              fileName: file.name,
              fileBlob: blobData,
              createdBy: userInfo.userName,
            }
            await tx
              .insert(documentsTable)
              .values(document)
              .returning()            
          }
        }
      })
      // Set cover for the paperwork
      const documents = await db.select().from(documentsTable).where(eq(documentsTable.paperworkId, ppwULID))
      const documentImages = documents.filter((doc) =>
        doc.fileName.endsWith('.jpg')
        || doc.fileName.endsWith('.png')
        || doc.fileName.endsWith('.jpeg')
        || doc.fileName.endsWith('.gif')
        || doc.fileName.endsWith('.svg')
        || doc.fileName.endsWith('.bmp')
        || doc.fileName.endsWith('.tiff'))
      if (documentImages.length > 0) {
        await db.update(documentsTable).set({isCover: 1}).where(eq(documentsTable.id, documentImages[0].id))
      }
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
        issueAt: t.Optional(t.String()),
        price: t.Optional(t.String()),
        priceCurrency: t.Optional(t.String()),
      })
    })
