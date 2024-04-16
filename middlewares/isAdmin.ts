import { Elysia } from "elysia";
import * as jose from 'jose'
import { bearer } from '@elysiajs/bearer'
import type { TokenInterface } from "../models/TokenInterface";


// This is a middleware that will be used to get check if the user is an admin from token
// aslo it will be used to check if the token is expired or not
export const isAdmin = (app: Elysia) => 
    app
    .use(bearer())
    .derive(async ({bearer, set}) => {
        if (bearer == undefined || bearer == null) {
            set.status = 401
            throw new Error("Bearer not found")
        }
        let jwtDecoded: any = null
        try {
            jwtDecoded = await jose.jwtVerify(bearer, new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
        } catch (error) {
            console.log(error)
        }
        if (jwtDecoded != null) {
            const userInfo: TokenInterface = jwtDecoded.payload
            if (userInfo.role === "admin") {
                return {
                    isAdmin: true
                }
            }
            return {
                isAdmin: false
            }
        }
        set.status = 401
        throw new Error("Unauthorized")
    })

