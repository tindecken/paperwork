import { Elysia } from 'elysia'
import { sessionInfo } from '../../middlewares/sessionInfo'
import { filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { eq, and, inArray } from "drizzle-orm";


export const getFiles = (app: Elysia) =>
    app
    .use(sessionInfo)
        // get associated file by user
    .get('/getAssociatedFiles', async ({ user }) => {
        const usersFiles = await db.select().from(usersFilesTable).where(
            and(
                eq(usersFilesTable.userId, user.id),
                eq(usersFilesTable.isDeleted, 0)
            ))
        if (usersFiles.length == 0) {
            return {
                success: true,
                message: 'No associated files',
                data: [],
            } as GenericResponseInterface
        }
        const files = await db.select().from(filesTable).where(inArray(filesTable.id, usersFiles.map(uf => uf.fileId)))
        const res: GenericResponseInterface = {
            success: true,
            message: 'Get associated files successfully',
            data: files,
        }
        return res
    }, {
        auth: true
    })