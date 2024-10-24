// remove documents from paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import {documentsTable, paperworksTable} from "../../drizzle/schema";
import { db } from "../../drizzle";
import {and, eq, sql} from "drizzle-orm";
import { isAdmin } from "../../libs/isAdmin";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
import sharp from "sharp";
export const setCover = (app: Elysia) =>
  app.use(userInfo)
.post(
    "/setCover",
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
      // update isCover = 0 for all documents
      await db.update(documentsTable).set({ isCover: 0, coverBlob: null}).where(eq(documentsTable.paperworkId, body.paperworkId))

      sharp(documentPaperwork[0].fileBlob).resize(200, 200).toBuffer().then(async (buffer: Buffer) => {
        await db.update(documentsTable).set({isCover: 1, coverBlob: buffer}).where(
          and(
            eq(documentsTable.paperworkId, body.paperworkId),
            eq(documentsTable.id, body.documentId)
          )
        )
      })
      // update paperwork updatedAt and updatedBy
      await db.update(paperworksTable).set({
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
        updatedBy: userInfo.userName
      }).where(eq(paperworksTable.id, body.paperworkId))
      const res: GenericResponseInterface = {
        success: true,
        message: `Set cover for paperwork success!`,
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
