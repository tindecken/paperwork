// remove documents from paper work
import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import { documentsTable } from "../../drizzle/schema";
import { db } from "../../drizzle";
import {and, eq} from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
import { arrayBufferToBase64 } from "../../libs/libs";

import { S3Client, type S3File } from "bun";

const client = new S3Client({
  accessKeyId: process.env["MINIO_ACCESSKEYID"],
  secretAccessKey: process.env["MINIO_SECRETACCESSKEY"],
  bucket: process.env["MINIO_BUCKET"],
  endpoint: process.env["MINIO_ENDPOINT"],
});

export const getreturnmd5 = (app: Elysia) =>
  app.use(userInfo)
  .get('/getreturnmd5/:documentId', async ({ params: { documentId }, set }) => {
    const documents = await db
    .select()
    .from(documentsTable)
    .where(and(
      eq(documentsTable.id, documentId),
    ))
    if (documents.length === 0) {
      set.status = 404;
      throw new Error("Document not found or deleted")
    }
    // download file from S3
    const file: S3File = await client.file(documents[0].coverPath!)
    const buffer = await file.arrayBuffer();
    const base64String = arrayBufferToBase64(buffer)
    const res: GenericResponseInterface = {
      success: true,
      message: "Get document successfully!",
      data: base64String,
    }
    return res;
  },
  {
    params: t.Object({
      documentId: t.String(),
    }),
  })

