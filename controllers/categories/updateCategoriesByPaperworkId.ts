import { Elysia, t } from 'elysia';
import {categoriesTable, paperworksCategoriesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, and } from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";

export const updateCategoriesByPaperworkId = (app: Elysia) =>
  app
      .use(userInfo)
      .put('/updateCategories', async ({ userInfo }) => {
          const paperworkCategories = await db.delete().from(paperworksCategoriesTable).where(
              and(
                  eq(paperworksCategoriesTable.paperworkId, body.paperworkId),
                  eq(paperworksCategoriesTable.isDeleted, 0)
              )
          )
        const res: GenericResponseInterface = {
          success: true,
          message: `Get ${categories.length} categories successfully!`,
          data: data
        }
        return res
      }, {
          body: t.Object({
              paperworkId: t.String(),
              categoryIds: t.Array(t.String())
          })
      });