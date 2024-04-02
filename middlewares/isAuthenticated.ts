import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt'
import cookie from "@elysiajs/cookie";

export const isAuthenticated = (app: Elysia) => 
    app.use(jwt({
        name: 'jwt',
        secret: Bun.env.JWT_SECRET!,
        exp: 86400
    }))
    .derive(async ({cookie: { access_token }, jwt, set}) => {
        if (!access_token.value) {
            set.status = 401
            return {
                success: false,
                message: "Unauthorized",
                data: null
            }
        }
        console.log('access_token', access_token.value)
        console.log('Bun.env.JWT_SECRET', Bun.env.JWT_SECRET)
        const userInfo = await jwt.verify(access_token.value)
        console.log('userInfoooo', userInfo)
        if (userInfo === false) {
            set.status = 401
            return {
                success: false,
                message: "Unauthorized",
                data: null
            }
        }
        return {
            userInfo
        }
    })