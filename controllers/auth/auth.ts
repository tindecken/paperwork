import {Elysia, t} from "elysia"
import db from '../../drizzle/db'
import { users, usersFilesRelations } from '../../drizzle/schema/schema'
import { hashPassword, comparePassword } from '../../libs/bcrypt'
import * as jose from 'jose'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from "drizzle-typebox"
import type { TokenInterface } from "../../models/TokenInterface"
import type { GenericResponseInterface } from "../../models/GenericResponseInterface"
import {bearer} from "@elysiajs/bearer"

const createUser = createInsertSchema(users)

export const auth = (app: Elysia) => app
    .use(bearer())
    .group('/auth', (app) =>
        app
        .post('/login', async ({ body, set, error }) => {
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
                return error(401, 'Invalid credentials')
            }
            const alg = 'HS256'
            const token = await new jose.SignJWT({ 
                userId: user[0].id, 
                name: user[0].name,
                userName: user[0].userName,
                email: user[0].email,
                maxEpx: Date.now() + 60 * 60 * 20000
            })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
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
                hash,
                salt
            }
            const user = await db
                .insert(users)
                .values(registerUser)
                .returning()
            const res: GenericResponseInterface = {
                success: true,
                message: "Register success",
                data: null
            }
            return res
        }, {
            body: t.Omit(t.Composite([createUser, t.Object({password: t.String({minLength: 3, maxLength: 100})})]), ['id','hash', 'salt']),
        })
        .post('/refreshtoken', async ({bearer, set}) => {
            if (!bearer) {
                set.status = 401
                return {
                    success: false,
                    message: "Unauthorized",
                    data: null
                }
            }
            const payload = await jose.decodeJwt(bearer) as TokenInterface
                const maxExpired = payload.maxEpx
                console.log('maxExpired', maxExpired)
                console.log('Date.now()', Date.now())
                if (Date.now() > maxExpired) {
                    set.status = 401
                    return {
                        success: false,
                        message: "Unauthorized",
                        data: null
                    }
                } else {
                    // Generate new token with the same maxExpired
                    const token = await new jose.SignJWT({ 
                        userId: payload.userId, 
                        name: payload.name,
                        userName: payload.userName,
                        email: payload.email,
                        maxEpx: payload.maxEpx,
                        role: payload.role,
                        fileId: payload.fileId
                    })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('2h')
                    .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
                    return {
                        success: true,
                        message: "Refresh token success",
                        data: {
                            token
                        }
                    }
                }
            
        })
        .onError(({ error }: { error: any }) => {
            console.log('error', error)
            const res: GenericResponseInterface = {
                success: false,
                message: error.response || error.toString(),
                data: null
            }
            return res
        })
    )