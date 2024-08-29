import { ulid } from 'ulid';
import { db } from '../drizzle'
import { logsTable, type InsertLog } from "../drizzle/schema.ts";


export const log = async (log: InsertLog) => {
  log = {
    ...log,
    id: ulid()
  }
  await db.insert(logsTable).values(log)
}