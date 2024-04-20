
/*
    Check user right and delete file
*/

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { isAdmin } from '../../libs/isAdmin'
import { files, usersFiles } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
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
        const file = await db.query.files.findFirst({
            where: eq(files.id, id)
        })
        if (!file) {
            throw new Error("File not found")
        }
        await db.delete(usersFiles).where(eq(usersFiles.fileId, id)        )
        await db.update(files)
          .set({ isActive: false })
          .where(eq(files.id, id))
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
