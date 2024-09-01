
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
    Update token with new fileId, role
*/ 

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import * as jose from 'jose'
import { ulid } from 'ulid'

export const createFile = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/create', async ({body, userInfo}) => {
        const newFile: typeof filesTable.$inferInsert = {
            id: ulid(),
            name: body.name,
            description: body.description,
            createdBy: userInfo.userName
        }
        const createdfile = await db
            .insert(filesTable)
            .values(newFile)
            .returning()
        const newUserFile: typeof usersFilesTable.$inferInsert = {
            id: ulid(),
            userId: userInfo.userId,
            fileId: createdfile[0].id,
            role: 'admin',
            isSelected: 1,
            createdBy: userInfo.userName
        }
        await db.insert(usersFilesTable).values(newUserFile)
        const alg = process.env["JWT_ALGORITHM"] || 'HS256'
            const token = await new jose.SignJWT({
                userId: userInfo.userId,
                name: userInfo.name,
                userName: userInfo.userName,
                email: userInfo.email,
                systemRole: userInfo.systemRole,
                selectedFileId: createdfile[0].id,
                role: newUserFile.role,
                maxEpx: Date.now() + 60 * 60 * 20000
            })
                .setProtectedHeader({alg})
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))

        const res: GenericResponseInterface = {
            success: true,
            message: `Created file ${createdfile[0].name} successfully!`,
            data: { token, file: createdfile[0] }
        }
        return res
    }, {
        body: t.Object({
            name: t.String(),
            description: t.Optional(t.String())
        }),
    })