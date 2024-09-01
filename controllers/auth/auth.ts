import {Elysia, t} from "elysia"
import { db } from '../../drizzle'
import {usersFilesTable, usersTable} from '../../drizzle/schema'
import {comparePassword, hashPassword} from '../../libs/bcrypt'
import * as jose from 'jose'
import {and, eq} from 'drizzle-orm'
import {createInsertSchema} from "drizzle-typebox"
import type {TokenInterface} from "../../models/TokenInterface"
import type {GenericResponseInterface} from "../../models/GenericResponseInterface"
import {bearer} from "@elysiajs/bearer"

const createUser = createInsertSchema(usersTable)

export const auth = (app: Elysia) => app
    .use(bearer())
    .group('/auth', (app) =>
        app
        .post('/login', async ({ body, set }) => {
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.userName, body.userName))
            if (user.length === 0) {
                set.status = 401
                throw new Error('User not found')
            }
            const isPasswordValid = await Bun.password.verify(body.password, user[0].password)
            if (!isPasswordValid) {
                set.status = 402
                throw new Error('Invalid credentials')
            }
            // Get selectedFiles
            const usersFiles = await db.select().from(usersFilesTable).where(
                and(
                    eq(usersFilesTable.userId, user[0].id),
                    eq(usersFilesTable.isSelected, 1)
                )
            )
            const alg = process.env["JWT_ALGORITHM"] || 'HS256'
            const token = await new jose.SignJWT({
                userId: user[0].id,
                name: user[0].name,
                userName: user[0].userName,
                email: user[0].email,
                systemRole: user[0].systemRole,
                selectedFileId: usersFiles.length > 0 ? usersFiles[0].fileId : null,
                role: usersFiles.length > 0 ? usersFiles[0].role : null,
                maxEpx: Date.now() + 60 * 60 * 20000
            })
                .setProtectedHeader({alg})
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
            const res: GenericResponseInterface = {
                success: true, message: "Login success", data: {
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
            const hashedPassword = await Bun.password.hash(body.password)
            const registerUser = {
                ...body,
                password: hashPassword
            }
            await db
                .insert(usersTable) 
                .values(registerUser)
            const res: GenericResponseInterface = {
                success: true,
                message: "Register success",
                data: null
            }
            return res
        }, {
            body: t.Omit(t.Composite([createUser, t.Object({password: t.String({minLength: 3, maxLength: 100})})]), ['id','password']),
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
                        selectedFileId: payload.selectedFileId
                    })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('23h')
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