import {Elysia, t} from "elysia"
import db from '../../drizzle/db'
import { files } from '../../drizzle/schema/schema'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from "../../middlewares/isAuthenticated"


export const filesController = (app: Elysia) => app
    .group('/files', (app) =>
        app.use(isAuthenticated)
        .post('/create', async ({ body }) => {
            return {
                body
            }
        }, {body: t.Object({userName: t.String({maxLength: 100}), password: t.String({minLength: 3, maxLength: 100})}), beforeHandle: ({set, userInfo}) => {
            if (!userInfo) {
                return (set.status = 'Unauthorized')
            }
        }})
    )