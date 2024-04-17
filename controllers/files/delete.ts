
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
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
            throw new Error("Fobidden")
        }
        // Delete userFile and file
        const userFile = await db.query.usersFiles.findFirst({
            where: and(eq(usersFiles.fileId, id), eq(usersFiles.userId, userInfo.userId))
        })
        if (userFile) {
            console.log('userFile', userFile)
            return {userFile}
        }
        throw new Error(`There is no file with id: ${id}`)
    }, {
        params: t.Object({
            id: t.Numeric()
        })
    })
