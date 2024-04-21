
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
    Update token with new fileId, role
*/ 

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { documents } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
export const uploadDocument = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/upload', async ({body, userInfo, set}) => {
        if (body.file.length > 20) {
          set.status = 400
          throw new Error('You can only upload up to 20 files at a time!')
        }
        for (const file of body.file) {
          if (file.size > 1024 * 1024 * 10) {
            throw new Error(`File ${file.name} with file size ${file.size} is greater than 10MB! Please upload a smaller file.`)
          }
        }
        for (const file of body.file) {
          const fileArrayBuffer = await file.arrayBuffer();
          const blobData = new Uint8Array(fileArrayBuffer);
          const newDocument: typeof documents.$inferInsert = {
            fileSize: file.size,
            fileName: file.name,
            fileBlob: blobData,
            createdBy: userInfo.userName
          }
          await db
            .insert(documents)
            .values(newDocument)
        }
    }, {
        body: t.Object({
            file: t.Files()
        })
    })