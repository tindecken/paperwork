// Add documents to paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import { documentsTable, paperworksTable, type InsertDocument } from "../../drizzle/schema";
import { db } from "../../drizzle/index";
import {eq, sql} from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
import { isAdmin } from "../../libs/isAdmin";
import { ulid } from "ulid";
import sharp from 'sharp'
import { IMAGE_FILE_TYPE } from "../constants/imageType";
import { S3Client, type S3File } from "bun";


const client = new S3Client({
  accessKeyId: process.env["MINIO_ACCESSKEYID"],
  secretAccessKey: process.env["MINIO_SECRETACCESSKEY"],
  bucket: process.env["MINIO_BUCKET"],
  endpoint: process.env["MINIO_ENDPOINT"],
});


export const addDocuments = (app: Elysia) =>
  app.use(userInfo)
  .post("/upload", async ({ body, userInfo }) => {
    const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!);
    if (!isAdminRights) {
      throw new Error("Forbidden");
    }
    const paperwork = await db.select().from(paperworksTable).where(eq(paperworksTable.id, body.paperworkId))
    if (paperwork.length === 0) {
      throw new Error(`Paper work ${body.paperworkId} not found`)
    }
    if (body.file.size > Number(process.env["MAX_FILE_SIZE_IN_MB"]) * 1024 * 1024) {
      throw new Error(
        `File ${body.file.name} with file size ${body.file.size} is greater than 10MB! Please upload a smaller file.`
      );
    }
    const fileArrayBuffer = await body.file.arrayBuffer();
    if (fileArrayBuffer.byteLength === 0)
      throw new Error(`File ${body.file.name} is empty!`);
    const filePath = `${userInfo.selectedFileId}\\${body.paperworkId}\\${body.file.name}`
    const s3File: S3File = client.file(filePath);
    await s3File.write(fileArrayBuffer);
    const newDocument: InsertDocument = {
      id: ulid(),
      paperworkId: body.paperworkId,
      fileSize: body.file.size,
      fileName: body.file.name,
      filePath: filePath,
      createdBy: userInfo.userName,
    };
    await db.insert(documentsTable).values(newDocument);
    // check if file is an image, then reduce size
    const fileWithoutExtension = body.file.name.substring(0, body.file.name.lastIndexOf('.'));
    const fileExtension = body.file.name.substring(body.file.name.lastIndexOf('.') + 1);
    const reducedFileName = `${fileWithoutExtension}_reduced.${fileExtension}`;
    const reducedFilePath = `${userInfo.selectedFileId}\\${body.paperworkId}\\${newDocument.id}.${fileExtension}`;
    if (IMAGE_FILE_TYPE.includes(fileExtension.toLowerCase())) {
      await sharp(fileArrayBuffer)
      .jpeg({ quality: 50 })
      .toFile(reducedFileName)
      .then(async () => {
        await db.update(documentsTable).set({ reducedImageSizeFilePath: reducedFilePath}).where(eq(documentsTable.id, newDocument.id))
      });
    }
    // update paperwork updatedAt and updatedBy
    await db.update(paperworksTable).set({
      updatedAt: sql`(CURRENT_TIMESTAMP)`,
      updatedBy: userInfo.userName
    }).where(eq(paperworksTable.id, body.paperworkId))
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