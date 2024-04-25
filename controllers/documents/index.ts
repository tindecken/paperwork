import { Elysia } from "elysia";
import { addDocuments } from "./add";
import { removeDocuments } from "./remove";

export const documentsController = new Elysia({ prefix: "/documents" })
  .use(addDocuments)
  .use(removeDocuments);
