import { Elysia, t } from 'elysia'
import { userInfo } from '../../middlewares/userInfo.ts'
import { documentsTable, paperworksCategoriesTable, paperworksTable } from '../../drizzle/schema.ts'
import { db } from '../../drizzle/index'
import {isAdmin} from "../../libs/isAdmin.ts";
import {eq} from "drizzle-orm";
import type {GenericResponseInterface} from "../../models/GenericResponseInterface.ts";


export const deletePaperWork = (app: Elysia) =>
  app
    .use(userInfo)
    .delete('/delete/:paperworkId', async ({params: { paperworkId }, userInfo, set}) => {
      const paperWork = await db
        .select()
        .from(paperworksTable)
        .where(eq(paperworksTable.id, paperworkId))
      if (paperWork.length === 0) {
        throw new Error("Paper work not found")
      }
      const isAdminRights = await isAdmin(userInfo.userId, userInfo.selectedFileId!)
      if(!isAdminRights) {
        set.status = 403
        const res: GenericResponseInterface = {
          success: false,
          message: "Forbidden",
          data: null
        }
        return res
      }
      // update is Deleted = 1 for paperworksTable
      await db.update(paperworksTable).set({ isDeleted: 1 }).where(eq(paperworksTable.id, paperworkId))
      // update is Deleted = 1 for documentsTable
      await db.update(documentsTable).set({ isDeleted: 1 }).where(eq(documentsTable.paperworkId, paperworkId))
      // update isDeleted = 1 for paperworksCategoriesTable
      await db.update(paperworksCategoriesTable).set({ isDeleted: 1 }).where(eq(paperworksCategoriesTable.paperworkId, paperworkId))

      // return success response with message and data as null
      const res: GenericResponseInterface = {
        success: true,
        message: `Delete paperwork ${paperWork[0].name} successfully!`,
        data: null
      }
      return res
    }, {
      params: t.Object({
        paperworkId: t.String({minLength: 26, maxLength: 26})
      })
    })