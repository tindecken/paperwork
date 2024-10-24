import {Elysia, t} from "elysia"
import { db } from '../../drizzle'
import {themesTable, usersFilesTable, usersTable, type InsertUser} from '../../drizzle/schema'
import * as jose from 'jose'
import {and, eq} from 'drizzle-orm'
import {createInsertSchema} from "drizzle-typebox"
import type {TokenInterface} from "../../models/TokenInterface"
import type {GenericResponseInterface} from "../../models/GenericResponseInterface"
import {bearer} from "@elysiajs/bearer"
import { ulid } from "ulid"

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
                set.status = 1
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
            // get first theme
            const themes = await db.select().from(themesTable)
            if (themes.length === 0) {
                throw new Error("Default themes not found")
            }
            const defaultThemeId = themes[0].id
            
            const hashedPassword = await Bun.password.hash(body.password)
            const registerUser: InsertUser = {
                id: ulid(),
                ...body,
                password: hashedPassword,
                themeId: defaultThemeId
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
            body: t.Object({
                name: t.String({maxLength: 100}),
                userName: t.String({minLength: 3, maxLength: 100}),
                email: t.String({format: 'email', maxLength: 100}),
                password: t.String({minLength: 3, maxLength: 100}),
            })
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