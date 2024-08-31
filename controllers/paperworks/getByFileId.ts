import { Elysia, t } from 'elysia';
import {categoriesTable, paperworksCategoriesTable, paperworksTable, type SelectPaperwork, type SelectPaperworkWithCategoryName} from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";

export const getByFileid = (app: Elysia) =>
  app
      .use(userInfo)
      .get('/getPaperworks', async ({ userInfo, params }) => {
        console.log('params', params)
        const categories = await db.select().from(categoriesTable).where(
            and(
              eq(categoriesTable.fileId, userInfo.selectedFileId!),
              eq(categoriesTable.isDeleted, 0)
            )
        )
        const ppws: SelectPaperworkWithCategoryName[] = []
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
                   categoryId: cat.id
                }))
            })
        )
        // Filtering and sorting based on query parameters
        

        const res: GenericResponseInterface = {
          success: true,
          message: `Get ${ppws.length} paperworks successfully!`,
          data: ppws
        }
        return res
      });