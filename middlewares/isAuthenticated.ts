import { Elysia } from "elysia";
import * as jose from 'jose'
import { bearer } from '@elysiajs/bearer'
import type { GenericResponseInterface } from "../models/GenericResponseInterface";

export const isAuthenticated = (app: Elysia) => 
    app
    .use(bearer())
    .derive(async ({bearer, set}) => {
        if (bearer == undefined) {
            console.log('bearer', bearer)
            set.status = 401
            const res = {
                success: false,
                message: "fsdfsdfsd",
                data: null
            }
            return res
        }
        let jwtDecoded: any = null
        console.log('bejwtDecodedarer', jwtDecoded)
        try {
            jwtDecoded = await jose.jwtVerify(bearer, new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
        } catch (error) {
            console.log(error)
        }
        if (jwtDecoded != null) {
            const userInfo = jwtDecoded.payload
            return {
                userInfo
            }
        }
        return {
            success: false,
            message: "Unauthorized",
            data: null
        }        
    })