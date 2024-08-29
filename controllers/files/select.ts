
/*
    Create new file record in table files
    Create new record in usersFiles with: role = admin
    Update token with new fileId, role
*/ 

import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { createInsertSchema } from "drizzle-typebox"
import { filesTable, usersFilesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import * as jose from 'jose'


export const selectFile = (app: Elysia) =>
    app
    .use(userInfo)
    .post('/selectFile', async ({body, userInfo}) => {
        
        const res: GenericResponseInterface = {
            success: true,
            message: `Create file ${file[0].name} successfully!`,
            data: { token, file }
        }
        return res
    }, {
        body: t.Object({
            fileId: t.String()
        }),
    })