import { and, eq } from 'drizzle-orm'
import { db } from '../drizzle/index'
import { usersFilesTable } from "../drizzle/schema";


// Getting admin rights
export const isAdmin = async (userId: number, fileId: number) => {
  const record = await db
    .query.usersFilesTable.findFirst({
      where: and(
        eq(usersFilesTable.userId, userId),
        eq(usersFilesTable.fileId, fileId),
        eq(usersFilesTable.role, 'admin')
      ),
    })
  if (record) {
    return true
  }
  return false
}

