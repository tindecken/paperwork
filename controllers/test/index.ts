import { Elysia } from 'elysia'
import { setRedis, getRedis } from './setGetRedis'

export const testsController = new Elysia({ prefix: '/tests'})
    .use(setRedis)
    .use(getRedis)
