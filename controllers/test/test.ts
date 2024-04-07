import {Elysia, t} from "elysia"
import type { GenericResponseInterface } from "../../models/GenericResponseInterface"


export const testController = (app: Elysia) => app
    .group('/test', (app) =>
        app.get('/response', () => {
            const res: GenericResponseInterface = {
                success: true,
                message: "Test",
                data: null
            }
            return res
        })
    )