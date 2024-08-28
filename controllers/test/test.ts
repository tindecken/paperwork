import {Elysia } from "elysia"
import type { GenericResponseInterface } from "../../models/GenericResponseInterface"


export const testController = (app: Elysia) => app
    .group('/test', (app) =>
        app.derive(() => {
            const res: GenericResponseInterface = {
                success: true,
                message: "Test",
                data: null
            }
            return {res}
        })
        .derive(() => {
            return {}
        })
    )