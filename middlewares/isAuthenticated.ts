import { Elysia } from "elysia";
import * as jose from 'jose'

export const isAuthenticated = (app: Elysia) => 
    app
    .derive(async ({cookie: { access_token }, set}) => {
        if (!access_token.value) {
            set.status = 401
            return {
                success: false,
                message: "Unauthorized",
                data: null
            }
        }
        let jwtDecoded: any = null
        try {
            jwtDecoded = await jose.jwtVerify(access_token.value, new TextEncoder().encode(Bun.env.JWT_SECRET!))
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