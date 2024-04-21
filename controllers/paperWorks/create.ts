import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { paperWorks, paperWorksDocuments } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {isAdmin} from "../../libs/isAdmin.ts";


const createPaperWorkSchema = createInsertSchema(paperWorks)
const createPaperWorksDocumentsSchema = createInsertSchema(paperWorksDocuments)
export const createPaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .post('/create/:categoryId', async ({body, params: { categoryId }, userInfo, set}) => {
      console.log('categoryId', categoryId)
      console.log('name', body.name)
      console.log('description', body.description)
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.fileId!)
      if(!isAdminRights) {
        throw new Error("Forbidden")
      }
      if (body.files.length > 20) {
        set.status = 400
        throw new Error('You can only upload up to 20 files at a time!')
      }
      for (const file of body.files) {
        if (file.size > 1024 * 1024 * 10) {
          throw new Error(`File ${file.name} with file size ${file.size} is greater than 10MB! Please upload a smaller file.`)
        }
      }
    }, {
      body: t.Omit(t.Composite([createPaperWorkSchema, t.Object({files: t.Files()})]), ['id', 'categoryId', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']),
      params: t.Object({
        categoryId: t.Numeric()
      })
    })