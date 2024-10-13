// Add documents to paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import { documentsTable, paperworksTable, type InsertDocument } from "../../drizzle/schema";
import { db } from "../../drizzle/index";
import {eq} from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
import { isAdmin } from "../../libs/isAdmin";
import { ulid } from "ulid";
export const addDocuments = (app: Elysia) =>
  app.use(userInfo)
  .post(
    "/addmultiple",
    async ({ body, userInfo, set }) => {
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!);
      if (!isAdminRights) {
        throw new Error("Forbidden");
      }
      if (body.files.length > 20) {
        set.status = 400;
        throw new Error("You can only upload up to 20 files at a time!");
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
      for (const file of body.files) {
        if (file.size > 1024 * 1024 * 10) {
          throw new Error(
            `File ${file.name} with file size ${file.size} is greater than 10MB! Please upload a smaller file.`
          );
        }
      }
      for (const file of body.files) {
        const fileArrayBuffer = await file.arrayBuffer();
        if (fileArrayBuffer.byteLength === 0)
          throw new Error(`File ${file.name} is empty!`);
        const blobData = new Uint8Array(fileArrayBuffer);
        const newDocument: typeof documentsTable.$inferInsert = {
          id: ulid(),
          paperworkId: body.paperWorkId,
          fileSize: file.size,
          fileName: file.name,
          fileBlob: blobData,
          createdBy: userInfo.userName,
        };
        await db.insert(documentsTable).values(newDocument);
      }
      const res: GenericResponseInterface = {
        success: true,
        message: `Added ${body.files.length} document(s) to paper work ${paperWork[0].name} successfully!`,
        data: null,
      };
      return res;
    },
    {
      body: t.Object({
        files: t.Files(),
        paperWorkId: t.String(),
      }),
    }
  )
  .post("/upload", async ({ body, userInfo }) => {
    const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!);
    if (!isAdminRights) {
      throw new Error("Forbidden");
    }
    const paperwork = await db.select().from(paperworksTable).where(eq(paperworksTable.id, body.paperworkId))
    if (paperwork.length === 0) {
      throw new Error(`Paper work ${body.paperworkId} not found`)
    }
    if (body.file.size > 1024 * 1024 * 10) {
      throw new Error(
        `File ${body.file.name} with file size ${body.file.size} is greater than 10MB! Please upload a smaller file.`
      );
    }
    const fileArrayBuffer = await body.file.arrayBuffer();
      if (fileArrayBuffer.byteLength === 0)
        throw new Error(`File ${body.file.name} is empty!`);
      const blobData = new Uint8Array(fileArrayBuffer);
      const newDocument: InsertDocument = {
        id: ulid(),
        paperworkId: body.paperworkId,
        fileSize: body.file.size,
        fileName: body.file.name,
        fileBlob: blobData,
        createdBy: userInfo.userName,
      };
      await db.insert(documentsTable).values(newDocument);
    const res: GenericResponseInterface = {
      success: true,
      message: `Added ${body.file.name} document to paper work ${paperwork[0].name} successfully!`,
      data: null,
    };
    return res;
  }, {
    body: t.Object({
      file: t.File(),
      paperworkId: t.String(),
    }),
  })
