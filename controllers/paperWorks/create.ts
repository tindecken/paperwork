import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import {documents, paperWorks, paperWorksDocuments, categories} from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";


const createPaperWorkSchema = createInsertSchema(paperWorks)
export const createPaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .post('/create/:categoryId', async ({body, params: { categoryId }, userInfo, set}) => {
      console.log('files length:', body.files?.length)
      console.log('files', body.files)
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId)
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
      for (const file of body.files) {
        if (file.size > 1024 * 1024 * 10) {
          throw new Error(`File ${file.name} with file size ${file.size} is greater than 10MB! Please upload a smaller file.`)
        }
      }
      await db.transaction(async (tx) => {
        const ppw: typeof paperWorks.$inferInsert = {
          categoryId: categoryId,
          name: body.name,
          description: body.description,
          createdBy: userInfo.userName
        }
        const insertedPaperWork = await tx.insert(paperWorks).values(ppw).returning()
        // upload files
        for (const file of body.files) {
          console.log('fileeee', file)
          const fileArrayBuffer = await file.arrayBuffer();
          const blobData = new Uint8Array(fileArrayBuffer);
          const newDocument: typeof documents.$inferInsert = {
            fileSize: file.size,
            fileName: file.name,
            fileBlob: blobData,
            createdBy: userInfo.userName
          }
          const uploadedFile = await tx
            .insert(documents)
            .values(newDocument)
            .returning()

          //mapping paperwork with documents
          const ppwDocuments: typeof paperWorksDocuments.$inferInsert = {
            paperWorkId: insertedPaperWork[0].id,
            documentId: uploadedFile[0].id
          }
          await tx
            .insert(paperWorksDocuments)
            .values(ppwDocuments)
        }
      })

    }, {
      body: t.Omit(t.Composite([createPaperWorkSchema, t.Object({files: t.MaybeEmpty(t.Files())})]), ['id', 'categoryId', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']),
      params: t.Object({
        categoryId: t.Numeric()
      })
    })