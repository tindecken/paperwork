import {Elysia, t} from "elysia"
import db from '../../drizzle/db'
import { users } from '../../drizzle/schema/schema'
import { hashPassword, comparePassword } from '../../libs/bcrypt'
import * as jose from 'jose'
import { eq } from 'drizzle-orm'


export const auth = (app: Elysia) => app
    .group('/auth', (app) =>
        app.post('/login', async ({ body, set, cookie: { access_token } }) => {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.userName, body.userName))
            if (user.length === 0) {
                set.status = 401
                return 'User not found'
            }
            const isPasswordValid = await comparePassword(
                body.password,
                user[0].salt,
                user[0].hash
            )
            if (!isPasswordValid) {
                set.status = 401
                return 'Invalid credentials'
            }
            const alg = 'HS256'
            const token = await new jose.SignJWT({ 
                id: user[0].id, 
                name: user[0].name,
                userName: user[0].userName,
                email: user[0].email
            })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(Bun.env.JWT_SECRET!))
            
            // const tokenFake = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUsIm5hbWUiOiJIb2FuZzMzIiwidXNlck5hbWUiOiJ0aW5kZWNrZW4zIiwiZW1haWwiOiJ0aW5kZWNrZW4zM0BnbWFpbC5jb20iLCJpYXQiOjE3MTIwMTYzMTksImlzcyI6InVybjpleGFtcGxlOmlzc3VlciIsImF1ZCI6InVybjpleGFtcGxlOmF1ZGllbmNlIiwiZXhwIjoxNzEyMDIzNTE5fQ.YnUpMBHmhoVYrijrq0Wm8FCE_jCGfeNPXFv-u4UMCQs'
            // const { payload, protectedHeader } = await jose.jwtVerify(tokenFake, new TextEncoder().encode(Bun.env.JWT_SECRET!), {
            //     issuer: 'urn:example:issuer',
            //     audience: 'urn:example:audience',
            //   })
              
            //   console.log(protectedHeader)
            //   console.log(payload)
            access_token.set({
                value: token,
                httpOnly: true,
                maxAge: 7 * 86400,
                path: '/',
            })
            return {
                'access_token': token
            }
        }, {
            body: t.Object({
                userName: t.String({maxLength: 100}),
                password: t.String({minLength: 3, maxLength: 100}),
            })
        })
        .post('/register', async ({body}) => {
            const { hash, salt } = await hashPassword(body.password)
            const registerUser = {
                ...body,
                hash: hash,
                salt
            }
            const user = await db
                .insert(users)
                .values(registerUser)
                .returning()
            return user
        }, {
            body: t.Object({
                name: t.String({maxLength: 150}),
                userName: t.String({maxLength: 100}),
                email: t.String({format: 'email', maxLength: 100}),
                password: t.String({minLength: 3, maxLength: 100}),
            })
        })
    )