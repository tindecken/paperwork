import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { files, usersFiles, paperWorks, categories } from '../../drizzle/schema'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, getTableColumns, asc, desc} from "drizzle-orm";


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
        // const filePaperWorks = await db.query.files.findFirst({
        //     where: eq(files.id, 1),
        //     with: {
        //         categories: {
        //             with: {
        //                 paperWorks: {
        //                     limit: 1000,
        //             }
        //         }
        //     }
        // }})
        // return filePaperWorks
        // const allPPWs = await db.select().from(paperWorks)
        const filePaperWorks = await db.select({
            paperWork: getTableColumns(paperWorks)
        }).from(paperWorks)
            .leftJoin(categories, eq(paperWorks.categoryId, categories.id))
            .leftJoin(files, eq(files.id, categories.fileId))
            .where(eq(files.id, 1))
            .orderBy(desc(orderBy ? paperWorks['orderBy'] : paperWorks.createdAt))
            .limit(1)
            .offset(1)
        return filePaperWorks
    }, {
        query: t.Object({
            pageNumber: t.Numeric(),
            pageSize: t.Numeric(),
            orderBy: t.Optional(t.String()),
            orderDir: t.Optional(t.String())
        })
    })