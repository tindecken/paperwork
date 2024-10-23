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
const listenPort = 3001
const tls = (process.env.NODE_ENV === 'production') ? {
    cert: Bun.file(process.env['CERT']!),
    key: Bun.file(process.env['KEY']!)
}: {}
const encoder = new TextEncoder()
new Elysia()
    .mapResponse(({ response, set }) => {
      const isJson = typeof response === 'object'

      const text = isJson
        ? JSON.stringify(response)
        : response?.toString() ?? ''

      set.headers['Content-Encoding'] = 'gzip'

      return new Response(
        Bun.gzipSync(encoder.encode(text)),
        {
          headers: {
            'Content-Type': `${
              isJson ? 'application/json' : 'text/plain'
            }; charset=utf-8`
          }
        }
      )
    })
    .use(swagger())
    .group('/test', (app) => 
        app.get('/env', async () => {
            return {
                'process.env.NODE_ENV': process.env.NODE_ENV,
                'process.env.TURSO_CONNECTION_URL': process.env['TURSO_CONNECTION_URL'] || 'not set',
            }
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
        port: listenPort,
        tls
    })

