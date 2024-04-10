import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { auth } from './controllers/auth/auth'
import { filesController } from './controllers/files/files'
import { cookie } from "@elysiajs/cookie";
import { testController } from './controllers/test/test'
import type { GenericResponseInterface } from './models/GenericResponseInterface'

const app = new Elysia()
    .group('/api', (app) => 
        app.use(swagger())
        .onError(({ error }: { error: any }) => {
            console.log('error', error)
            const res: GenericResponseInterface = {
                success: false,
                message: error.response || error.toString(),
                data: null
            }
            return res
        })
        .use(cors())
        .use(cookie())
        .use(auth)
        .use(filesController)
        .use(testController)
        .get('/', () => 'Welcome to api.')
        
    )
    .listen(3000)

