import { Elysia } from "elysia";
import { addDocuments } from "./add";
import { removeDocuments } from "./remove";
import { setCover } from "./setCover.ts";
import { download } from "./download.ts";
import { getreturnmd5 } from "./test_returnmd5.ts";

export const documentsController = new Elysia({ prefix: "/documents" })
  .use(addDocuments)
  .use(removeDocuments)
  .use(setCover)
  .use(download)
  .use(getreturnmd5)
