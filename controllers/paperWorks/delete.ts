import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo.ts'
import { documentsTable, paperWorksTable } from '../../drizzle/schema.ts'
import { db } from '../../drizzle/index'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";


export const deletePaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .delete('/delete/:paperworkId', async ({params: { paperworkId }, userInfo}) => {
      const paperWork = await db
        .select()
        .from(paperWorksTable)
        .where(eq(paperWorksTable.id, paperworkId))
        .limit(1)
        .execute()
      if (paperWork.length === 0) {
        throw new Error("Paper work not found")
      }
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.fileId!)
      if(!isAdminRights) {
        throw new Error("Forbidden")
      }
      // delete paperwork
      await db
        .delete(paperWorksTable)
        .where(eq(paperWorksTable.id, paperworkId))
      // delete document
      await db
        .delete(documentsTable)
        .where(eq(documentsTable.paperWorkId, paperworkId))
      const res: GenericResponseInterface = {
        success: true,
        message: `Delete paper work ${paperWork[0].name} successfully!`,
        data: null
      }
      return res
    }, {
      params: t.Object({
        paperworkId: t.Numeric()
      })
    })