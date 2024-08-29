// remove documents from paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import { documentsTable, paperworksTable } from "../../drizzle/schema";
import { db } from "../../drizzle/index";;
import { eq } from "drizzle-orm";
import { isAdmin } from "../../libs/isAdmin";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
export const removeDocuments = (app: Elysia) =>
  app.use(userInfo).delete(
    "/remove",
    async ({ body, userInfo }) => {
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!);
      if (!isAdminRights) {
        throw new Error("Forbidden");
      }
      const paperWork = await db
        .select()
        .from(paperworksTable)
        .where(eq(paperworksTable.id, body.paperWorkId))
        .limit(1)
        .execute()
      if (paperWork.length === 0) {
        throw new Error(`Paper work ${body.paperWorkId} not found`)
      }
      let deletedCount: number = 0
      for(const documentId of body.documentIds) {
        const deletedDocument = await db
          .delete(documentsTable)
          .where(eq(documentsTable.id, documentId))
          .returning()
          console.log('deletedDocument', deletedDocument)
          if (deletedDocument.length !== 0) {
            deletedCount += 1
          }
      }
      const res: GenericResponseInterface = {
        success: true,
        message: `Removed ${deletedCount} document(s) of paper work ${paperWork[0].name} successfully!`,
        data: null,
      };
      return res;
    },
    {
      body: t.Object({
        paperWorkId: t.Numeric(),
        documentIds: t.Array(t.Numeric()),
      }),
    }
  );
