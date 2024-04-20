
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
    Update token with new fileId, role
*/ 

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { files, usersFiles } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import * as jose from 'jose'


const createFileSchema = createInsertSchema(files)
export const createFile = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/create', async ({body, userInfo}) => {
    const newFile: typeof files.$inferInsert = {
        name: body.name,
        description: body.description,
        createdBy: userInfo.userName
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
    const alg = 'HS256'
    const token = await new jose.SignJWT({ 
        userId: userInfo.userId,
        name: userInfo.name,
        userName: userInfo.userName,
        email: userInfo.email,
        maxEpx: Date.now() + 60 * 60 * 20000,
        fileId: file[0].id,
        role: 'admin'
    })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
    const res: GenericResponseInterface = {
        success: true,
        message: `Create file ${file[0].name} successfully!`,
        data: { token }
    }
    return res
}, {
    body: t.Omit(createFileSchema, ['id', 'createdAt', 'updatedAt']),
})