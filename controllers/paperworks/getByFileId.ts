import { Elysia, t } from 'elysia';
import {categoriesTable, documentsTable, paperworksCategoriesTable, paperworksTable, type SelectPaperworkWithCategory} from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and, count } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";

export const getByFileid = (app: Elysia) =>
  app
      .use(userInfo)
      .get('/getPaperworks', async ({ userInfo, query }) => {
        console.log('query', query)
        const categories = await db.select().from(categoriesTable).where(
            and(
              eq(categoriesTable.fileId, userInfo.selectedFileId!),
              eq(categoriesTable.isDeleted, 0)
            )
        )
        let ppws: SelectPaperworkWithCategory[] = []
        await Promise.all(
            categories.map(async (cat) => {
                const paperworks = await db.select().from(paperworksTable).innerJoin(paperworksCategoriesTable, eq(paperworksTable.id, paperworksCategoriesTable.paperworkId)).where(
                    and(
                        eq(paperworksCategoriesTable.categoryId, cat.id),
                        eq(paperworksCategoriesTable.isDeleted, 0)
                    )
                )
                paperworks.forEach((p) => ppws.push({
                   ...p.paperworks,
                   categoryName: cat.name,
                   categoryDescription: cat.description ?? '',
                   categoryId: cat.id,
                   coverBlob: null,
                   coverFileName: null,
                   coverFileSize: null,
                   documentCount: null
                }))
            })
        )
        // filter
        if (query.filterValue) {
          ppws = ppws.filter((p) => p.name.toLowerCase().includes(query.filterValue!.toLowerCase()) 
          || (p.description && p.description.toLowerCase().includes(query.filterValue!.toLowerCase())) 
          || (p.categoryName.toLowerCase().includes(query.filterValue!.toLowerCase()))
          || (p.categoryDescription && p.categoryDescription.toLowerCase().includes(query.filterValue!.toLowerCase()))
          || (p.price && p.price.toString().toLowerCase().includes(query.filterValue!.toLowerCase()))
          || (p.priceCurrency && p.priceCurrency.toLowerCase().includes(query.filterValue!.toLowerCase()))
          || (p.issuedAt && p.issuedAt.toString().toLowerCase().includes(query.filterValue!.toLowerCase()))
          || (p.createdAt && p.createdAt.toString().toLowerCase().includes(query.filterValue!.toLowerCase())))
        }
        // sort
        if (query.sortField && query.sortDirection) {
          ppws.sort((a, b) => {
            const sortField = query.sortField as keyof SelectPaperworkWithCategory;
            if (query.sortDirection === 'asc') {
              return a[sortField]! > b[sortField]! ? 1 : -1;
            } else {
              return a[sortField]! < b[sortField]! ? 1 : -1;
            }
          });
        } else{
          // sort by createdAt desc
          ppws.sort((a, b) => {
            return a.createdAt! > b.createdAt! ? -1 : 1;
          });
        }
        // limit
        if (query.pageNumber && query.pageSize) {
          ppws = ppws.slice((query.pageNumber - 1) * query.pageSize, query.pageNumber * query.pageSize)
        }
        
        // get covers for paperworks
        await Promise.all(
          ppws.map(async (ppw) => {
            const documentsWithCover = await db.select().from(documentsTable).where(
                and(
                    eq(documentsTable.paperworkId, ppw.id),
                    eq(documentsTable.isCover, 1),
                    eq(documentsTable.isDeleted, 0)
                )
            )
            // update ppws with cover
            if (documentsWithCover.length > 0) {
              ppw.coverBlob = documentsWithCover[0].fileBlob
              ppw.coverFileName = documentsWithCover[0].fileName
              ppw.coverFileSize = documentsWithCover[0].fileSize as number
            }
        })
        )
        // get number of document for each paperwork
        await Promise.all(
          ppws.map(async (ppw) => {
            const documentsCount = await db.select({ count: count() }).from(documentsTable).where(
                and(
                    eq(documentsTable.paperworkId, ppw.id),
                    eq(documentsTable.isDeleted, 0)
                )
            )
            ppw.documentCount = documentsCount[0].count as number;
          })
        )
        const res: GenericResponseInterface = {
          success: true,
          message: `Get ${ppws.length} paperworks successfully!`,
          data: ppws
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