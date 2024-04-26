import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { files, usersFiles, paperWorks } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq} from "drizzle-orm";


export const getPaperWorks = (app: Elysia) =>
    app
    .use(userInfo)
    .get('/paperWorks', async ({query: { pageNumber, pageSize, orderBy, orderDir }, userInfo}) => {
        console.log('userInfo', userInfo)
        console.log('pageNumber', pageNumber)
        console.log('pageSize', pageSize)
        console.log('pageSize', pageSize)
        console.log('orderBy', orderBy)
        console.log('orderDir', orderDir)
        if (userInfo.fileId == undefined) {
            throw new Error('No file is selected')
        }
        const filePaperWorks = await db.query.files.findFirst({
            offset: 1,
            where: eq(files.id, 1),
            with: {
                categories: {
                    with: {
                        paperWorks: {
                            limit: pageSize,
                    }
                }
            }
        }})
        return filePaperWorks
    }, {
        query: t.Object({
            pageNumber: t.Numeric(),
            pageSize: t.Numeric(),
            orderBy: t.Optional(t.String()),
            orderDir: t.Optional(t.String())
        })
    })