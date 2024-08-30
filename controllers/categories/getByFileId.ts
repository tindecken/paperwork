import { Elysia, t } from 'elysia';
import {categoriesTable, paperworksCategoriesTable, paperworksTable} from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";

export const getCategoriesByFileId = (app: Elysia) =>
  app
      .use(userInfo)
      .get('/getCategories', async ({ userInfo }) => {
        const categories = await db.select().from(categoriesTable).where(
            and(
              eq(categoriesTable.fileId, userInfo.selectedFileId!),
              eq(categoriesTable.isDeleted, 0)
            )
        )
        const data = await Promise.all(
            categories.map(async (cat) => {
                const paperworkCount = await db.select({id: paperworksCategoriesTable.id}).from(paperworksCategoriesTable).where(
                    and(
                        eq(paperworksCategoriesTable.categoryId, cat.id),
                        eq(paperworksCategoriesTable.isDeleted, 0)
                    )
                )
                return {
                    ...cat,
                    paperworkCount: paperworkCount.length
                }
            })
        )
        const res: GenericResponseInterface = {
          success: true,
          message: `Get ${categories.length} categories successfully!`,
          data: data
        }
        return res
      });