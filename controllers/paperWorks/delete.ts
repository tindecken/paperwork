import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo.ts'
import { paperWorks } from '../../drizzle/schema/schema.ts'
import db from '../../drizzle/db.ts'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq, sql} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";


export const deletePaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .delete('/update/:paperworkId', async ({params: { paperworkId }, userInfo}) => {
      const paperWork = await db
        .select()
        .from(paperWorks)
        .where(eq(paperWorks.id, paperworkId))
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
      await db
        .delete(paperWorks)
        .where(eq(paperWorks.id, paperworkId))
      // get all documentId associated with this paperwork
      const res: GenericResponseInterface = {
        success: true,
        message: 'Delete paper work successfully!',
        data: null
      }
      return res
    }, {
      params: t.Object({
        paperworkId: t.Numeric()
      })
    })