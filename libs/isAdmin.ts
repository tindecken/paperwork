import { and, eq } from 'drizzle-orm'
import { db } from '../drizzle'
import {usersFilesTable, usersTable} from "../drizzle/schema.ts";

// Getting admin rights
export const isAdmin = async (userId: string, selectedFileId: string) => {
  console.log('userId', userId)
  console.log('selectedFileId', selectedFileId)
  if (selectedFileId === undefined) {
    throw new Error('Please selected file first')
  }
  const user = await db.select().from(usersTable).where(
    and(
      eq(usersTable.id, userId),
      eq(usersTable.isDeleted, 0),
    ))
  if (user.length === 0) {
    throw new Error('User not found or deleted')
  }
  else {
    const userFile = await db.select().from(usersFilesTable).where(
      and(
        eq(usersFilesTable.userId, userId),
        eq(usersFilesTable.fileId, selectedFileId),
      ))
    if (userFile.length > 0) {
      if (userFile[0].role === 'admin') {
        return true
      }
      return false
    }
    else {
      throw new Error(`The user does not associate with the file ${selectedFileId}`)
    }
  }
}

