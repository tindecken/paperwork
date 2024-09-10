import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { auth } from './controllers/auth/auth'
import { filesController } from './controllers/files'
import { themesController } from './controllers/themes'
import { cookie } from "@elysiajs/cookie";
import type { GenericResponseInterface } from './models/GenericResponseInterface'
import { documentsController } from "./controllers/documents";
import { paperworksController } from "./controllers/paperworks";
import {categoriesController} from "./controllers/categories";
import type {InsertLog} from "./drizzle/schema.ts";
import {ulid} from "ulid";
import {log} from "./libs/logging.ts";
new Elysia()
    .use(swagger())
    .group('/test', (app) => 
        app.get('/env', async () => {
            return Bun.env
        })
    )
    .group('/api', (app) =>
        app
        .use(cors())
        .use(cookie())
        .use(auth)
        .use(documentsController)
        .use(filesController)
        .use(paperworksController)
        .use(categoriesController)
        .use(themesController)
        .onError(async ({ code, error, request }: { code: any, error: any, request: Request }) => {
            const logRecord: InsertLog = {
                id: ulid(),
                message: error.message || error.response,
                request: JSON.stringify(request),
            }
            await log(logRecord)
            switch(code) {
                case 'VALIDATION':
                    var errorValue = JSON.parse(error.message)
                    const resValidation: GenericResponseInterface = {
                        success: false,
                        message: `Validation Error: [${errorValue.message} ${errorValue.property}]`,
                        data: errorValue
                    }
                    return resValidation
                default: // Unknown Error
                    const res: GenericResponseInterface = {
                        success: false,
                        message: error.response || error.message,
                        data: null
                    }
                    return res
            }
        })
    )
    .listen({
        port: 3001,
        // tls: {
        //     cert: Bun.file('/etc/letsencrypt/live/tindecken.xyz/fullchain.pem'),
        //     key: Bun.file('/etc/letsencrypt/live/tindecken.xyz/privkey.pem')
        //   }
    })

