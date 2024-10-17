// remove documents from paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import {documentsTable, paperworksTable} from "../../drizzle/schema";
import { db } from "../../drizzle";
import {and, eq, sql} from "drizzle-orm";
import { isAdmin } from "../../libs/isAdmin";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
export const removeDocuments = (app: Elysia) =>
  app.use(userInfo).delete(
    "/remove",
    async ({ body, userInfo, set }) => {
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!);
      if (!isAdminRights) {
        set.status = 403;
        const res: GenericResponseInterface = {
          success: false,
          message: "Forbidden",
          data: null,
        }
        return res
      }
      const documentPaperwork = await db
        .select()
        .from(documentsTable)
        .where(
          and(
            eq(documentsTable.id, body.documentId),
            eq(documentsTable.paperworkId, body.paperworkId)
          )
        )
      if (documentPaperwork.length === 0) {
        set.status = 404
        const res: GenericResponseInterface = {
          success: false,
          message: `Document or paperwork not found`,
          data: null
        }
        return res
      }
      await db.update(documentsTable).set({ isDeleted: 1, isCover: 0 }).where(
        and(
          eq(documentsTable.id, body.documentId),
          eq(documentsTable.paperworkId, body.paperworkId)
        )
      )
      // update paperwork updatedAt and updatedBy
      await db.update(paperworksTable).set({
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
        updatedBy: userInfo.userName
      }).where(eq(paperworksTable.id, body.paperworkId))
      const res: GenericResponseInterface = {
        success: true,
        message: `Removed document successfully!`,
        data: null,
      };
      return res;
    },
    {
      body: t.Object({
        paperworkId: t.String(),
        documentId: t.String(),
      }),
    }
  );
