import {Elysia, t} from "elysia"
import db from '../../drizzle/db'
import { files } from '../../drizzle/schema/schema'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from "../../middlewares/isAuthenticated"


export const filesController = (app: Elysia) => app
    .group('/files', (app) =>
        app.use(isAuthenticated)
        .post('/create', async ({ body, userInfo }) => {
            console.log('userInfo', userInfo)
            return {
                ...body,
                ...userInfo
            }
        }, {
            body: t.Object({
                name: t.String({maxLength: 100}),
                description: t.String({maxLength: 2000}),
            })
        })
    )