import { Elysia } from "elysia";
import { getThemes } from "./get.ts";

export const themesController = new Elysia({ prefix: "/themes" })
  .use(getThemes)
