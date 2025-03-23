import { Elysia, t } from 'elysia'
import { sessionInfo } from '../../middlewares/sessionInfo.ts'
import { paperworksTable } from '../../drizzle/schema.ts'
import { db } from '../../drizzle'
import {isAdmin} from "../../libs/isAdmin.ts";
import { eq, sql } from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface.ts";


export const updatePaperWork = (app: Elysia) => {
  return app
    .use(sessionInfo)
    .put('/update/:paperworkId', async ({body, params: {paperworkId}, user, selectedFileId}) => {
      const paperWork = await db
        .select()
        .from(paperworksTable)
        .where(eq(paperworksTable.id, paperworkId))
        .limit(1)
        .execute()
      if (paperWork.length === 0) {
        throw new Error("Paper work not found")
      }
      const isAdminRights = await isAdmin(user.id, selectedFileId)
      if (!isAdminRights) {
        throw new Error("Forbidden")
      }
      const updatedPaperWork = await db
        .update(paperworksTable)
        .set({
          name: body.name,
          description: body.description,
          issuedAt: body.issueAt,
          price: body.price,
          priceCurrency: body.priceCurrency,
          updatedAt: sql`CURRENT_TIMESTAMP`,
          updatedBy: user.name
        })
        .where(eq(paperworksTable.id, paperworkId))
        .returning()
      const res: GenericResponseInterface = {
        success: true,
        message: `Update paper work successfully!`,
        data: updatedPaperWork
      }
      return res
    }, {
      auth: true,
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        issueAt: t.Optional(t.Union([t.Null(), t.String()])),
        price: t.Optional(t.Union([t.Null(), t.Number()])),
        priceCurrency: t.Optional(t.String()),
      }),
      params: t.Object({
        paperworkId: t.String()
      })
    });
}