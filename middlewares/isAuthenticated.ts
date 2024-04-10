import { Elysia } from "elysia";
import * as jose from 'jose'
import { bearer } from '@elysiajs/bearer'
import type { GenericResponseInterface } from "../models/GenericResponseInterface";

export const isAuthenticated = (app: Elysia) => 
    app
    .use(bearer())
    .derive(async ({bearer, set, error}) => {
        if (bearer == undefined) {
            return error(401, "Bearer not found")
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