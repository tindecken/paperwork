import { sql, eq } from 'drizzle-orm'
import {users, files, usersFiles, categories, paperWorksDocuments, paperWorks, documents} from './schema/schema'
import db from "./db.ts";

const documentIds = await db.query.paperWorksDocuments.findMany({
    columns: { id: true},
    where: eq(paperWorksDocuments.paperWorkId, 1)
})

console.log('documentIds', documentIds)