import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { auth } from './controllers/auth'
import { filesController } from './controllers/files'
import { cookie } from "@elysiajs/cookie";

const app = new Elysia()
    .group('/api', (app) => 
        app.use(swagger())
        .use(cors())
        .use(cookie())
        .use(auth)
        .use(filesController)
        .get('/', () => 'Welcome to api.')
    )
    .listen(3000)

