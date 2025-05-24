import {Elysia, t} from "elysia"
import type {GenericResponseInterface} from "../../models/GenericResponseInterface"
import {bearer} from "@elysiajs/bearer"
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
                  }
                });
                set.status = 200
                const res: GenericResponseInterface = {
                  success: false,
                  message: 'Signup successful',
                  data: result.user
                }
                return res
              } catch (error) {
                if (error instanceof APIError) {
                  set.status = 400
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
        .post(
            "/loginWithEmail",
            async ({ body, set }) => {
              try{
                const { email, password } = body;
                const result = await auth.api.signInEmail({
                  body: {
                    email,
                    password
                  }
                });

                set.status = 200
                const res: GenericResponseInterface = {
                  success: true,
                  message: 'Login successful',
                  data: result
                }
                return res
              } catch (error) {
                if (error instanceof APIError) {
                  set.status = 400
                  const res: GenericResponseInterface = {
                    success: false,
                    message: error.message || 'Failed to login',
                    data: null
                  }
                  return res
                }
              }
            }, {
              body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 6 }),
                name: t.String({ minLength: 3 }),
              }),
            }
          )
    )