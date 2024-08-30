import { Elysia, t } from 'elysia';
import {categoriesTable, paperworksCategoriesTable, paperworksTable} from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";

export const getByFileid = (app: Elysia) =>
  app
      .use(userInfo)
      .get('/getPaperworks', async ({ userInfo }) => {
        const categories = await db.select().from(categoriesTable).where(
            and(
              eq(categoriesTable.fileId, userInfo.selectedFileId!),
              eq(categoriesTable.isDeleted, 0)
            )
        )
        const paperworks = await Promise.all(
            categories.map(async (cat) => {
                const paperworks = await db.select({id: paperworksTable.id}).from(paperworksTable).innerJoin(paperworksCategoriesTable, eq(paperworksTable.id, paperworksCategoriesTable.paperworkId)).where(
                    and(
                        eq(paperworksCategoriesTable.categoryId, cat.id),
                        eq(paperworksCategoriesTable.isDeleted, 0)
                    )
                )
                return {
                  paperworks
                }
            })
        )
        const res: GenericResponseInterface = {
          success: true,
          message: `Get ${categories.length} categories successfully!`,
          data: paperworks
        }
        return res
      });