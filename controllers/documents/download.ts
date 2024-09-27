// remove documents from paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import { documentsTable } from "../../drizzle/schema";
import { db } from "../../drizzle";
import {and, eq} from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
export const download = (app: Elysia) =>
  app.use(userInfo)
  .post("/download", async ({ body, userInfo, set }) => {
    const documents = await db
    .select()
    .from(documentsTable)
    .where(and(
      eq(documentsTable.paperworkId, body.paperworkId),
      eq(documentsTable.id, body.documentId),
      eq(documentsTable.isDeleted, 0),
    ))
    if (documents.length === 0) {
      set.status = 404;
      throw new Error("Document not found or deleted")
    }
    console.log(documents)
    const res: GenericResponseInterface = {
      success: true,
      message: "Get document blob successfully!",
      data: documents[0].fileBlob as any | null,
    }
    return res;
  },
  {
    body: t.Object({
      paperworkId: t.String(),
      documentId: t.String(),
    }),
  })
