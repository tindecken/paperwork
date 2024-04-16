
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
*/

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { files, usersFiles } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';

const createFileSchema = createInsertSchema(files)
export const createFile = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/create', async ({body, userInfo}) => {
    const newFile: typeof files.$inferInsert = {
        name: body.name,
        description: body.description,
    }
    const file = await db
        .insert(files)
        .values(newFile)
        .returning()
    const newUserFile: typeof usersFiles.$inferInsert = {
        userId: userInfo.userId,
        fileId: file[0].id,
        role: 'admin',
    }
    await db.insert(usersFiles).values(newUserFile)
    const res: GenericResponseInterface = {
        success: true,
        message: `Create file ${file[0].name} successfully!`,
        data: file[0]
    }
    return res
}, {
    body: t.Omit(createFileSchema, ['id', 'createdAt', 'updatedAt']),
})