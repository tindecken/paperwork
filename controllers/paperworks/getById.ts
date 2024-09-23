import { Elysia, t } from 'elysia';
import {categoriesTable, documentsTable, paperworksCategoriesTable, paperworksTable, type SelectCategory, type SelectPaperworkWithCategory} from '../../drizzle/schema.ts'
import { db } from '../../drizzle/index.ts'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface.ts';
import {eq, and, count } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";
import type { PaperworkDetails } from '../../models/PaperworkDetails.ts';

export const getById = (app: Elysia) =>
  app
      .use(userInfo)
      .get('/get/:paperworkId', async ({ userInfo, query, params: {paperworkId}, set }) => {
        console.log('paperworkId', paperworkId)
        const pw = await db.select().from(paperworksTable).where(
          and(
            eq(paperworksTable.id, paperworkId),
            eq(paperworksTable.isDeleted, 0)
          )
        )
        if (pw.length === 0) {
          set.status = 404;
          throw new Error('Paperwork not found or deleted')
        }
        const paperworkCategories = await db.select().from(paperworksCategoriesTable).where(
          and(
            eq(paperworksCategoriesTable.paperworkId, paperworkId),
            eq(paperworksCategoriesTable.isDeleted, 0)
          )
        )
        const categories: SelectCategory[] = []
        await Promise.all(
          paperworkCategories.map(async (pwCat) => {
            const cat = await db.select().from(categoriesTable).where(
              and(
                eq(categoriesTable.id, pwCat.categoryId),
                eq(categoriesTable.isDeleted, 0)
              )
            )
            if (cat.length > 0) {
              categories.push({...cat[0]})
            }
          })
        )
        // get attachments and images
        const ppwDocuments = await db.select({
          id: documentsTable.id,
          fileName: documentsTable.fileName,
          fileSize: documentsTable.fileSize,
        }).from(documentsTable).where(
          and(
            eq(documentsTable.paperworkId, paperworkId),
            eq(documentsTable.isDeleted, 0)
          )
        )
        const documentImages = ppwDocuments.filter((doc) => 
          doc.fileName.endsWith('.jpg') 
        || doc.fileName.endsWith('.png') 
        || doc.fileName.endsWith('.jpeg') 
        || doc.fileName.endsWith('.gif') 
        || doc.fileName.endsWith('.svg') 
        || doc.fileName.endsWith('.bmp') 
        || doc.fileName.endsWith('.tiff'))
        const documentImagesWithBlobs: {
          id: string
          fileName: string
          fileSize: number
          fileBlob: any | null
        }[] = []
        // get more fileBlob for documentImages
        await Promise.all(
          documentImages.map(async (doc) => {
            const fileBlobDoc = await db.select({ fileBlob: documentsTable.fileBlob}).from(documentsTable).where(
              and(
                eq(documentsTable.id, doc.id),
                eq(documentsTable.isDeleted, 0)
              )
            )
            if (fileBlobDoc.length > 0) {
              documentImagesWithBlobs.push({
                ...doc,
                fileBlob: fileBlobDoc[0].fileBlob,
              })
            }
          })
        )
        console.log('documentImagesWithBlobs', documentImagesWithBlobs)
        const documentAttachments = ppwDocuments.filter((doc) => !documentImages.includes(doc))
        
        const ppwDetails: PaperworkDetails = {
          ...pw[0],
          categories: categories,
          attachments: documentAttachments,
          images: documentImagesWithBlobs,
        }
        const res: GenericResponseInterface = {
          success: true,
          message: `Get paperwork successfully!`,
          data:ppwDetails,
        }
        return res
      }, {
        query: t.Object({
          pageNumber: t.Optional(t.Number()),
          pageSize: t.Optional(t.Number()),
          sortField: t.Optional(t.String()),
          sortDirection: t.Optional(t.TemplateLiteral('${asc|desc}')),
          filterValue: t.Optional(t.String()),
        })
      });