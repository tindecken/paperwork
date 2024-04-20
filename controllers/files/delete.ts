
/*
    Check user right and delete file
*/

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { isAdmin } from '../../middlewares/isAdmin'
import { files, usersFiles } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import { and, eq } from 'drizzle-orm'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';

export const deleteFile = (app: Elysia) =>
    app
    .use(userInfo)
    .use(isAdmin)
    .delete('/delete/:id', async ({params: { id }, userInfo, set, isAdmin}) => {
        console.log('isAdmin', isAdmin)
        if(isAdmin === false) {
            set.status = 401
            throw new Error("Forbidden")
        }
        // Delete userFile and file
        const userFile = await db.query.usersFiles.findFirst({
            where: and(eq(usersFiles.fileId, id), eq(usersFiles.userId, userInfo.userId))
        })
        if (userFile) {
            if(userFile.role === 'admin') {
                await db.query.usersFiles.deleteMany({
                    where: and(eq(usersFiles.fileId, id), eq(usersFiles.userId, userInfo.userId))
                })
                await db.query.files.delete({
                    where: eq(files.fileId, id)
                })
            }
            console.log('userFile', userFile)
            const res: GenericResponseInterface = {
                success: true,
                message: `Delete file ${userFile.fileId} successfully!`,
                data: userFile
            }
            return res
        }
        throw new Error(`There is no file with id: ${id}`)
    }, {
        params: t.Object({
            id: t.Numeric()
        })
    })
