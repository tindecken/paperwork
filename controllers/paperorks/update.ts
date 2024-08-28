import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo'
import { paperworksTable } from '../../drizzle/schema.ts'
import { db } from '../../drizzle'
import {isAdmin} from "../../libs/isAdmin.ts";
import { eq, sql } from "drizzle-orm";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface.ts";


export const updatePaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .put('/update/:paperworkId', async ({body, params: { paperworkId }, userInfo}) => {
      const paperWork = await db
        .select()
        .from(paperworksTable)
        .where(eq(paperworksTable.id, paperworkId))
        .limit(1)
        .execute()
      console.log('paperwork', paperWork)
      if (paperWork.length === 0) {
        throw new Error("Paper work not found")
      }
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.fileId!)
      if(!isAdminRights) {
        throw new Error("Forbidden")
      }
      const updatedPaperWork = await db
        .update(paperworksTable)
        .set({
          name: body.name,
          description: body.description,
          date: body.date,
          price: body.price,
          updatedAt: sql`CURRENT_TIMESTAMP`,
          updatedBy: userInfo.userName
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
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        price: t.Optional(t.String()),
      }),
      params: t.Object({
        paperworkId: t.Numeric()
      })
    })