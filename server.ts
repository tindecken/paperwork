import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { auth } from './controllers/auth/auth'
import { filesController } from './controllers/files/index'
import { cookie } from "@elysiajs/cookie";
import type { GenericResponseInterface } from './models/GenericResponseInterface'
import { documentsController } from "./controllers/documents";
import {paperWorksController} from "./controllers/paperWorks";

const app = new Elysia()
    .group('/api', (app) => 
        app
        .use(swagger())
        .use(cors())
        .use(cookie())
        .use(auth)
        .use(documentsController)
          .use(filesController)
          .use(paperWorksController)
        .onError(({ code, error }: { code: any, error: any }) => {
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
    .listen(3000)

