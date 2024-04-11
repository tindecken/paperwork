import {Elysia, t} from "elysia"
import { userInfo } from "../../middlewares/userInfo"


export const filesController = (app: Elysia) => app
    .use(userInfo)
    .group('/files', (app) =>
        app.get('/create', async ({userInfo}) => userInfo)
            .get('/delete', () => 'delete')
        )
    