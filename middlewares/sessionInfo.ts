import { Elysia } from "elysia";
import { auth } from "../libs/auth.ts";
import { db } from "../drizzle/index.ts";
import { eq, and, desc } from "drizzle-orm";
import { usersFilesTable } from "../drizzle/schema.ts";
// user middleware (compute user and session and pass to routes)
const sessionInfo = new Elysia()
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ error, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return error(401);
        // get selectedFileId 
        let selectedFileId = ''
        let role = ''
        const userFiles = await db.select().from(usersFilesTable).where(
            and(
                eq(usersFilesTable.userId, session["user"].id),
                eq(usersFilesTable.isDeleted, 0),
                eq(usersFilesTable.isSelected, 1)
            )
        ).orderBy(desc(usersFilesTable.updatedAt))
        if (userFiles.length > 0) {
            selectedFileId = userFiles[0].fileId
            role = userFiles[0].role
        }
        return {
          user: session["user"],
          session: session["session"],
          selectedFileId,
          role
        };
      },
    },
  });

export { sessionInfo };