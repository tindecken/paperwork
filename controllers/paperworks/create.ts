import { Elysia, t } from "elysia";
import { userInfo } from "../../middlewares/userInfo";
import {
  documentsTable,
  paperworksTable,
  categoriesTable,
  type InsertPaperwork,
  paperworksCategoriesTable,
} from "../../drizzle/schema.ts";
import { db } from "../../drizzle";
import { isAdmin } from "../../libs/isAdmin.ts";
import { and, eq } from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface.ts";
import { ulid } from "ulid";
import sharp from "sharp";
import { IMAGE_FILE_TYPE } from "../constants/imageType.ts";
import { S3Client, type S3File } from "bun";

const client = new S3Client({
  accessKeyId: process.env["MINIO_ACCESSKEYID"],
  secretAccessKey: process.env["MINIO_SECRETACCESSKEY"],
  bucket: process.env["MINIO_BUCKET"],
  endpoint: process.env["MINIO_ENDPOINT"],
});
export const createPaperWork = (app: Elysia) =>
  app.use(userInfo).post(
    "/create",
    async ({ body, userInfo, set }) => {
      if (body.name.trim().length == 0) {
        set.status = 400;
        throw new Error("Name is required!");
      }
      if (body.categoryId.trim().length != 0) {
        const category = await db.query.categoriesTable.findFirst({
          where: eq(categoriesTable.id, body.categoryId),
        });
        if (!category) {
          throw new Error(`Category ${body.categoryId} not found!`);
        }
      }
      const isAdminRights = await isAdmin(
        userInfo.userId,
        userInfo.selectedFileId!
      );
      if (!isAdminRights) {
        throw new Error("Forbidden");
      }
      if (body.files && body.files.length > 20) {
        set.status = 400;
        throw new Error("You can only upload up to 20 files at a time!");
      }
      if (body.files) {
        for (const file of body.files) {
          if (file.size > 1024 * 1024 * 20) {
            throw new Error(
              `File ${file.name} with file size ${file.size} is greater than 4MB! Please upload a smaller file.`
            );
          }
        }
      }
      const ppwULID = ulid();
      await db.transaction(async (tx) => {
        const ppw: InsertPaperwork = {
          id: ppwULID,
          name: body.name.trim(),
          description: body.description,
          issuedAt: body.issueAt,
          price: body.price ? parseFloat(body.price) : null,
          priceCurrency: body.priceCurrency,
          createdBy: userInfo.userName,
        };
        const insertedPaperWork = await tx
          .insert(paperworksTable)
          .values(ppw)
          .returning();
        // create paperwork-category relationship with category Uncategorized
        const uncategorizedCategory = await db.query.categoriesTable.findFirst({
          where: and(
              eq(categoriesTable.name, "Uncategorized"),
              eq(categoriesTable.fileId, userInfo.selectedFileId!),
            )
        });
        if (!uncategorizedCategory) {
          throw new Error("Category Uncategorized not found!");
        }
        const uncategorizedPwc: typeof paperworksCategoriesTable.$inferInsert = {
          id: ulid(),
          paperworkId: insertedPaperWork[0].id,
          categoryId: uncategorizedCategory.id,
          createdBy: userInfo.userName,
        };
        await tx.insert(paperworksCategoriesTable).values(uncategorizedPwc).returning();
        // create paperwork-category relationship
        if (body.categoryId !== '') {
          const pwc: typeof paperworksCategoriesTable.$inferInsert = {
            id: ulid(),
            paperworkId: insertedPaperWork[0].id,
            categoryId: body.categoryId,
            createdBy: userInfo.userName,
          };
          await tx.insert(paperworksCategoriesTable).values(pwc).returning();
        }
        // create documents for uploaded files
        if (body.files) {
          for (const file of body.files) {
            const fileArrayBuffer = await file.arrayBuffer();
            if (fileArrayBuffer.byteLength === 0)
              throw new Error(`File ${file.name} is empty!`);
            // upload file to S3
            const filePath = `${userInfo.selectedFileId}\\${insertedPaperWork[0].id}\\${file.name}`;
            const document: typeof documentsTable.$inferInsert = {
              id: ulid(),
              paperworkId: insertedPaperWork[0].id,
              fileSize: file.size,
              fileName: file.name,
              filePath: filePath,
              isDeleted: 0,
              createdBy: userInfo.userName,
            };
            await tx.insert(documentsTable).values(document).returning();
            const s3File: S3File = client.file(filePath);
            await s3File.write(fileArrayBuffer);
            
          }
        }
      });
      // Set cover for the paperwork and reduce size of images
      const documents = await db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.paperworkId, ppwULID));
      const documentImages = documents.filter((doc) => {
        const fileExtension = doc.fileName.substring(
          doc.fileName.lastIndexOf(".") + 1
        );
        return IMAGE_FILE_TYPE.includes(fileExtension.toLowerCase());
      });
      if (documentImages.length > 0) {
        // get file from S3 based on documentImages[0].filePath then create cover image
        const s3File: S3File = client.file(documentImages[0].filePath);
        const arrayBuffer = await s3File.arrayBuffer();
        await sharp(arrayBuffer)
          .resize(300, 300)
          .jpeg({ mozjpeg: true, quality: 80 })
          .toBuffer()
          .then(async (arrayBuffer: Buffer) => {
            const coverFileName = `${documentImages[0].fileName.substring(
              0,
              documentImages[0].fileName.lastIndexOf(".")
            )}_cover.jpg`;
            const coverFilePath = `${userInfo.selectedFileId}\\${ppwULID}\\${coverFileName}`;
            const s3File: S3File = client.file(coverFilePath);
            await s3File.write(arrayBuffer);
            await db
              .update(documentsTable)
              .set({ isCover: 1, coverPath: coverFilePath })
              .where(eq(documentsTable.id, documentImages[0].id));
          });
      }
      //reduce size of all images
      for (const image of documentImages) {
        const s3File: S3File = client.file(image.filePath);
        const buffer = await s3File.arrayBuffer();
        await sharp(buffer)
          .jpeg({ quality: 50 })
          .toBuffer()
          .then(async (arrayBuffer: Buffer) => {
            // check if file is an image, then reduce size
            const fileWithoutExtension = image.fileName.substring(
              0,
              image.fileName.lastIndexOf(".")
            );
            const fileExtension = image.fileName.substring(
              image.fileName.lastIndexOf(".") + 1
            );
            const reducedFileName = `${fileWithoutExtension}_reduced.${fileExtension}`;
            const reducedFilePath = `${userInfo.selectedFileId}\\${ppwULID}\\${reducedFileName}`;
            const s3File: S3File = client.file(reducedFilePath);
            await s3File.write(arrayBuffer, { type: "image/jpeg" });
            const reducedImageFileSize = arrayBuffer.byteLength;
            await db
              .update(documentsTable)
              .set({
                reducedImageSizeFilePath: reducedFilePath,
                reducedImageFileSize: reducedImageFileSize,
              })
              .where(eq(documentsTable.id, image.id));
          });
      }
      const res: GenericResponseInterface = {
        success: true,
        message: `Create paper work: ${body.name} successfully!`,
        data: null,
      };
      return res;
    },
    {
      body: t.Object({
        files: t.Optional(t.Files()),
        categoryId: t.String(),
        name: t.String(),
        description: t.Optional(t.String()),
        issueAt: t.Optional(t.String()),
        price: t.Optional(t.String()),
        priceCurrency: t.Optional(t.String()),
      }),
    }
  );
