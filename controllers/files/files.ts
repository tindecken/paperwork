import {Elysia, t} from "elysia"
import { isAuthenticated } from "../../middlewares/isAuthenticated"


export const filesController = (app: Elysia) => app
    .use(isAuthenticated)
    .group('/files', (app) =>
        app.guard({
            beforeHandle({ set, userInfo }) {
                if (!userInfo) {
                    return (set.status = 'Unauthorized')
                }
            }
        },
        (app) => app
            .get('/create', async () => 'getttttt')
            .get('/delete', () => 'delete')
        )
    )