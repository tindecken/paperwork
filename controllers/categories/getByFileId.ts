import { Elysia, t } from 'elysia';
import { categoriesTable } from '../../drizzle/schema'
import { db } from '../../drizzle'
import type { GenericResponseInterface } from '../../models/GenericResponseInterface';
import { eq, and } from "drizzle-orm"

export const getCategoriesByFileId = (app: Elysia) =>
  app.get('/getCategories', async ({ body }) => {
    const categories = await db.select().from(categoriesTable).where(
        and(
          eq(categoriesTable.fileId, body.fileId),
          eq(categoriesTable.isDeleted, 0)
        )
    )
    const res: GenericResponseInterface = {
      success: true,
      message: `Get ${categories.length} categories successfully!`,
      data: categories
    }
    return res
  }, {
    body: t.Object({
      fileId: t.String()
    }
  });