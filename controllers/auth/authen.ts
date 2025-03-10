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
import { auth } from "../../libs/auth"
import { APIError } from "better-auth/api";



export const authen = (app: Elysia) => app
    .use(bearer())
    .group('/auth', (app) =>
        app
        .post(
            "/signup",
            async ({ body, set }) => {
              try{
                const { email, password, name } = body;
                const result = await auth.api.signUpEmail({
                  body: {
                    name,
                    email,
                    password,
                    isDeleted: 0
                  }
                });
                set.status = 404
                const res: GenericResponseInterface = {
                  success: false,
                  message: 'Signup successful',
                  data: result.user
                }
                return res
              } catch (error) {
                if (error instanceof APIError) {
                  const res: GenericResponseInterface = {
                    success: false,
                    message: error.message || 'Failed to signup',
                    data: null
                  }
                  return res
                }
              }
            },
            {
              body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 6 }),
                name: t.String({ minLength: 3 }),
              }),
            }
          )
        // .post('/register', async ({body}) => {
        //     // get first theme
        //     const themes = await db.select().from(themesTable)
        //     if (themes.length === 0) {
        //         throw new Error("Default themes not found")
        //     }
        //     const defaultThemeId = themes[0].id
            
        //     const hashedPassword = await Bun.password.hash(body.password)
        //     const registerUser: InsertUser = {
        //         id: ulid(),
        //         ...body,
        //         password: hashedPassword,
        //         themeId: defaultThemeId
        //     }
        //     await db
        //         .insert(usersTable) 
        //         .values(registerUser)
        //     const res: GenericResponseInterface = {
        //         success: true,
        //         message: "Register success",
        //         data: null
        //     }
        //     return res
        // }, {
        //     body: t.Object({
        //         name: t.String({maxLength: 100}),
        //         userName: t.String({minLength: 3, maxLength: 100}),
        //         email: t.String({format: 'email', maxLength: 100}),
        //         password: t.String({minLength: 3, maxLength: 100}),
        //     })
        // })
        // .post('/refreshtoken', async ({bearer, set}) => {
        //     if (!bearer) {
        //         set.status = 401
        //         throw new Error("Unauthorized")
        //     }
        //     const payload = await jose.decodeJwt(bearer) as TokenInterface
        //         const maxExpired = payload.maxEpx
        //         if (Date.now() > maxExpired) {
        //             set.status = 401
        //             throw new Error("Current token is already expired")
        //         } else {
        //             // Generate new token with the same maxExpired
        //             const token = await new jose.SignJWT({ 
        //                 userId: payload.userId, 
        //                 name: payload.name,
        //                 userName: payload.userName,
        //                 email: payload.email,
        //                 maxEpx: payload.maxEpx,
        //                 role: payload.role,
        //                 selectedFileId: payload.selectedFileId
        //             })
        //             .setProtectedHeader({ alg: 'HS256' })
        //             .setIssuedAt()
        //             .setExpirationTime('23h')
        //             .sign(new TextEncoder().encode(Bun.env["JWT_SECRET"]!))
        //             const res: GenericResponseInterface = {
        //                 success: true,
        //                 message: "Refresh token success",
        //                 data: {
        //                     token
        //                 }
        //             }
        //             return res
        //         }
            
        // })
        // .post('/changepassword', async ({bearer, body}) => {
        //     if (!bearer) {
        //         throw new Error("Unauthorized")
        //     }
        //     const user = await db.select().from(usersTable).where(eq(usersTable.id, body.userId))
        //     if (user.length === 0) {
        //         throw new Error("User not found")
        //     }
        //     // verify newPassword and confirmNewPassword is the same
        //     const isPasswordValid = await Bun.password.verify(body.currentPassword, user[0].password)
        //     if (!isPasswordValid) {
        //         throw new Error("Invalid current password")
        //     }
        //     if (body.newPassword!== body.confirmNewPassword) {
        //         throw new Error("New password and confirm new password are not the same")
        //     }
        //     const hashedPassword = await Bun.password.hash(body.newPassword)
        //     await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, body.userId))
        //     const res: GenericResponseInterface = {
        //         success: true,
        //         message: "Change password success",
        //         data: null
        //     }
        //     return res
        // }, {
        //     body: t.Object({
        //         userId: t.String(),
        //         currentPassword: t.String(),
        //         newPassword: t.String(),
        //         confirmNewPassword: t.String()
        //       }),
        // })
    )