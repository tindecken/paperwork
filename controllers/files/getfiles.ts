import { Elysia } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { eq, and, inArray } from "drizzle-orm";


export const getFiles = (app: Elysia) =>
    app
    .use(userInfo)
        // get associated file by user
    .get('/getFiles', async ({ userInfo}) => {
        const usersFiles = await db.select().from(usersFilesTable).where(
            and(
                eq(usersFilesTable.userId, userInfo.userId),
                eq(usersFilesTable.isDeleted, 0)
            ))
        if (usersFiles.length == 0) {
            return {
                success: false,
                message: `Not found the associate between file and user`,
                data: [],
            } as GenericResponseInterface
        }
        console.log('usersFiles', usersFiles)
        const files = await db.select().from(filesTable).where(inArray(filesTable.id, usersFiles.map(uf => uf.fileId)))
        const res: GenericResponseInterface = {
            success: true,
            message: `Select file successfully`,
            data: files,
        }
        return res
    })