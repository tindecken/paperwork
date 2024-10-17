import { Elysia, t } from 'elysia';
import {
    type InsertPaperworksCategories,
    paperworksCategoriesTable,
    paperworksTable
} from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import {eq, sql} from "drizzle-orm"
import {userInfo} from "../../middlewares/userInfo.ts";
import {ulid} from "ulid";

export const updateCategoriesByPaperworkId = (app: Elysia) =>
  app
      .use(userInfo)
      .put('/updateCategories', async ({ userInfo, body }) => {
          // check paperworkId exist or not in table paperworks
          const existingPaperwork = await db.select().from(paperworksTable).where(eq(paperworksTable.id, body.paperworkId))
          if (existingPaperwork.length === 0) {
              throw new Error(`Paperwork with id ${body.paperworkId} does not exist`)
          }
          await db.delete(paperworksCategoriesTable).where(
              eq(paperworksCategoriesTable.paperworkId, body.paperworkId)
          )
          // re-add the paperwork categories
          await Promise.all(
              body.categoryIds.map(async (categoryId) => {
                  const paperworkCategory: InsertPaperworksCategories = {
                      id: ulid(),
                      paperworkId: body.paperworkId,
                      categoryId,
                      createdBy: userInfo.userName,
                      isDeleted: 0
                  }
                  await db.insert(paperworksCategoriesTable).values(paperworkCategory)
              })
          )
          // update paperwork updatedAt and updatedBy
          await db.update(paperworksTable).set({
              updatedAt: sql`(CURRENT_TIMESTAMP)`,
              updatedBy: userInfo.userName
          }).where(eq(paperworksTable.id, body.paperworkId))

          // return success response with message and data null
          const res: GenericResponseInterface = {
              success: true,
              message: 'Update categories successfully!',
              data: null
          }
          return res
      }, {
          body: t.Object({
              paperworkId: t.String(),
              categoryIds: t.Array(t.String())
          })
      });