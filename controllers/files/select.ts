import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { eq, and } from "drizzle-orm";


export const selectFile = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/selectFile', async ({body, userInfo}) => {
        const fileId = body.fileId
        const usersFiles = await db.select().from(usersFilesTable).where(
            and(
                eq(usersFilesTable.fileId, fileId),
                eq(usersFilesTable.userId, userInfo.userId),
                eq(usersFilesTable.isDeleted, 0)
            ))
        if (usersFiles.length == 0) {
            return {
                success: false,
                message: `Not found the associate between file and user`,
                data: null,
            } as GenericResponseInterface
        }
        await db.update(usersFilesTable).set({ isSelected: 0}).where(
            and(
                eq(usersFilesTable.userId, userInfo.userId)
            ))
        await db.update(usersFilesTable).set({ isSelected: 1}).where(
            and(
                eq(usersFilesTable.fileId, fileId),
                eq(usersFilesTable.userId, userInfo.userId),
                eq(usersFilesTable.isDeleted, 0)
            ))
        const res: GenericResponseInterface = {
            success: true,
            message: `Select file successfully`,
            data: null,
        }
        return res
    }, {
        body: t.Object({
            fileId: t.String()
        }),
    })