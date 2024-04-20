import { and, eq } from 'drizzle-orm'
import db from '../drizzle/db'
import { usersFiles } from "../drizzle/schema/schema";


// Getting admin rights
export const isAdmin = async (userId: number, fileId: number) => {
  const record = await db
    .query.usersFiles.findFirst({
      where: and(
        eq(usersFiles.userId, userId),
        eq(usersFiles.fileId, fileId),
        eq(usersFiles.role, 'admin')
      ),
    })
  if (record) {
    return true
  }
  return false
}

