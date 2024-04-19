import {Elysia, t} from "elysia"
import db from '../../drizzle/db'
import {users} from '../../drizzle/schema/schema'
import {comparePassword, hashPassword} from '../../libs/bcrypt'
import * as jose from 'jose'
import {eq} from 'drizzle-orm'
import {createInsertSchema} from "drizzle-typebox"
import type {TokenInterface} from "../../models/TokenInterface"
import type {GenericResponseInterface} from "../../models/GenericResponseInterface"
import {bearer} from "@elysiajs/bearer"

const createUser = createInsertSchema(users)

export const auth = (app: Elysia) => app
    .use(bearer())
    .group('/auth', (app) =>
        app
        .post('/login', async ({ body, set }) => {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.userName, body.userName))
            if (user.length === 0) {
                set.status = 401
                throw new Error('User not found')
            }
            const isPasswordValid = await comparePassword(
                body.password,
                user[0].salt,
                user[0].hash
            )
            if (!isPasswordValid) {
                set.status = 402
                throw new Error('Invalid credentials')
            }
            const alg = 'HS256'
            const token = await new jose.SignJWT({ 
                userId: user[0].id, 
                name: user[0].name,
                userName: user[0].userName,
                email: user[0].email,
                maxEpx: Date.now() + 60 * 60 * 20000
            })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
            const res: GenericResponseInterface = {
                success: true,
                message: "Login success",
                data: {
                    token
                }
            } 
            return res
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
            await db
                .insert(users)
                .values(registerUser)
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
                throw new Error("Unauthorized")
            }
            const payload = await jose.decodeJwt(bearer) as TokenInterface
                const maxExpired = payload.maxEpx
                if (Date.now() > maxExpired) {
                    set.status = 401
                    throw new Error("Current token is already expired")
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
                    const res: GenericResponseInterface = {
                        success: true,
                        message: "Refresh token success",
                        data: {
                            token
                        }
                    }
                    return res
                }
            
        })
    )