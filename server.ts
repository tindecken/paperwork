import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { auth } from './controllers/auth/auth'
import { filesController } from './controllers/files/files'
import { cookie } from "@elysiajs/cookie";
import { testController } from './controllers/test/test'

const app = new Elysia()
    .group('/api', (app) => 
        app.use(swagger())
        .use(cors())
        .use(cookie())
        .use(auth)
        .use(filesController)
        .use(testController)
        .get('/', () => 'Welcome to api.')
    )
    .listen(3000)

