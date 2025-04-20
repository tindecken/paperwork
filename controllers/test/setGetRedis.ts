import { redis } from "bun";
import { Elysia, t } from 'elysia'
import { sessionInfo } from '../../middlewares/sessionInfo'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';


export const setRedis = (app: Elysia) =>
    app
    .use(sessionInfo)
    .post('/redis/set', async ({body, user }) => {
        const value = await redis.set(body.key, body.value)
        const res: GenericResponseInterface = {
            success: true,
            message: `Set redis successfully!`,
            data: body.value
        }
        return res
    }, {
        auth: true,
        body: t.Object({
            key: t.String(),
            value: t.String()
        }),
    })

export const getRedis = (app: Elysia) =>
    app
    .use(sessionInfo)
    .post('/redis/get', async ({body, user }) => {
        const value = await redis.get(body.key)
        const res: GenericResponseInterface = {
            success: true,
            message: `Get redis successfully!`,
            data: value
        }
        return res
    }, {
        auth: true,
        body: t.Object({
            key: t.String(),
        }),
    })