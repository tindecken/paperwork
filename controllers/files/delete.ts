
/*
    Check user right and delete file
*/

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { isAdmin } from '../../libs/isAdmin'
import { filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import { eq } from 'drizzle-orm'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';

export const deleteFile = (app: Elysia) =>
    app
    .use(userInfo)
    .delete('/delete/:id', async ({params: { id }, userInfo}) => {
        const isAdminRights = await isAdmin(userInfo.userId, id)
        if(!isAdminRights) {
            throw new Error("Forbidden")
        }
        const file = await db.query.filesTable.findFirst({
            where: eq(filesTable.id, id)
        })
        if (!file) {
            throw new Error("File not found")
        }
        // delete record in usersFiles
        await db.delete(usersFilesTable).where(eq(usersFilesTable.fileId, id))
        // inactive file
        await db.update(filesTable)
          .set({ isDeleted: 1 })
          .where(eq(filesTable.id, id))
        const res: GenericResponseInterface = {
          success: true,
          message: `Delete file: ${file.name} successfully!`,
          data: null
        }
        return res
    }, {
        params: t.Object({
            id: t.Numeric()
        })
    })
