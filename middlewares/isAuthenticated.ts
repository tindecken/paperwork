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
        const tokenFake = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUsIm5hbWUiOiJIb2FuZzMzIiwidXNlck5hbWUiOiJ0aW5kZWNrZW4zIiwiZW1haWwiOiJ0aW5kZWNrZW4zM0BnbWFpbC5jb20iLCJpYXQiOjE3MTIwMTYzMTksImlzcyI6InVybjpleGFtcGxlOmlzc3VlciIsImF1ZCI6InVybjpleGFtcGxlOmF1ZGllbmNlIiwiZXhwIjoxNzEyMDIzNTE5fQ.YnUpMBHmhoVYrijrq0Wm8FCE_jCGfeNPXFv-u4UMCQs'
        let jwtDecoded: any = null
        try {
            jwtDecoded = await jose.jwtVerify(tokenFake, new TextEncoder().encode(Bun.env.JWT_SECRET!))
        } catch (error) {
            console.log(error)
        }
        console.log('jwtDecoded', jwtDecoded)
        if (jwtDecoded != null) {
            const userInfo = jwtDecoded.payload
            console.log('userInfooo', jwtDecoded.payload)
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