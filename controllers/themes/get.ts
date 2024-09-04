// Add documents to paper work
import { Elysia, t } from "elysia";
import { themesTable } from "../../drizzle/schema";
import { db } from "../../drizzle/index";
import type { GenericResponseInterface } from "../../models/GenericResponseInterface";
import { eq } from "drizzle-orm";
export const getThemes = (app: Elysia) =>
  app
  .get(
    "/themes",
    async () => {
      const themes = await db
        .select()
        .from(themesTable)
        .where(eq(themesTable.isDeleted, 0))
      if (themes.length === 0) {
        const res: GenericResponseInterface = {
          success: false,
          message: "No themes found",
          data: null,
        };
        return res;
      }
      const res: GenericResponseInterface = {
        success: true,
        message: "Get themes successfully!",
        data: themes,
      };
      return res;
    }
  )