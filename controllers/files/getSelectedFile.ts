import { Elysia } from 'elysia'
import { sessionInfo } from '../../middlewares/sessionInfo'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { eq, and, asc } from "drizzle-orm";
import { usersFilesTable } from '../../drizzle/schema';

export const getSelectedFile = (app: Elysia) =>
    app
    .use(sessionInfo)
    .get('/getSelectedFile', async ({ user }) => {
        const usersFiles = await db.select().from(usersFilesTable).where(
            and(
                eq(usersFilesTable.userId, user.id),
                eq(usersFilesTable.isDeleted, 0),
                eq(usersFilesTable.isSelected, 1)
            )).orderBy(asc(usersFilesTable.createdAt))
        if (usersFiles.length == 0) {
            return {
                success: true,
                message: `There's no seleted file for user`,
                data: null,
            } as GenericResponseInterface
        }
        const res: GenericResponseInterface = {
            success: true,
            message: `Select file successfully`,
            data: usersFiles[0],
        }
        return res
    }, {
        auth: true
    })