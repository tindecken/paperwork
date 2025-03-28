
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
    Update token with new fileId, role
*/ 

import { Elysia, t } from 'elysia'
import { sessionInfo } from '../../middlewares/sessionInfo'
import { categoriesTable, filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { ulid } from 'ulid'

export const createFile = (app: Elysia) =>
    app
    .use(sessionInfo)
    .post('/create', async ({body, user }) => {
        const newFile: typeof filesTable.$inferInsert = {
            id: ulid(),
            name: body.name,
            description: body.description,
            createdBy: user.name
        }
        const createdfile = await db
            .insert(filesTable)
            .values(newFile)
            .returning()
        const newUserFile: typeof usersFilesTable.$inferInsert = {
            id: ulid(),
            userId: user.id,
            fileId: createdfile[0].id,
            role: 'admin',
            isSelected: 1,
            createdBy: user.name
        }
        await db.insert(usersFilesTable).values(newUserFile)
        // create new Uncategory for the file
        await db.insert(categoriesTable).values({
            id: ulid(),
            fileId: createdfile[0].id,
            name: 'Uncategorized'
        })

        const res: GenericResponseInterface = {
            success: true,
            message: `Created file ${createdfile[0].name} successfully!`,
            data: createdfile[0]
        }
        return res
    }, {
        auth: true,
        body: t.Object({
            name: t.String(),
            description: t.Optional(t.String())
        }),
    })