import { Elysia } from "elysia";
import { auth } from "../libs/auth.ts";
import type { Session, User } from "better-auth/types";

type AuthResult = {
  user: User;
  session: Session;
};

const sessionInfo = new Elysia()
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ error, request: { headers } }): Promise<AuthResult | any>  {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return error(401);

        return {
          user: session["user"] as User,
          session: session["session"] as Session,
        };
      },
    },
  });

export { sessionInfo };