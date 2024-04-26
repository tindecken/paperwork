import { sql } from 'drizzle-orm'
import {users, files, usersFiles, categories, paperWorks} from './schema/schema'
import db from "./db.ts";

db.run(sql`DELETE FROM usersFiles`)
db.run(sql`DELETE FROM files`)
db.run(sql`DELETE FROM users`)
db.run(sql`DELETE FROM categories`)
db.run(sql`DELETE FROM paperWorks`)

const newUser1: typeof users.$inferInsert = {
  name: 'tindecken',
  email: 'tindecken@gmail.comm',
  userName: 'tindecken',
  hash: '13350f29e586ee4d86b1c9f4e3c8900ea704c15b202bbadba1a98e916072c7c150087f3ba1e1e47ae001c58fe481a1aa1c01deeb1dd2462ad2d8bd88dc16a10d',
  salt: 'ab921a2176a793495cd8a0868aab262f'
}
await db.insert(users).values(newUser1)

const newFile1: typeof files.$inferInsert = {
  name: 'file1',
  description: 'file1 description',
  createdBy: 'tindecken'
}
await db.insert(files).values(newFile1)
const newUserFile1: typeof usersFiles.$inferInsert = {
  userId: 1,
  fileId: 1,
  role: 'admin'
}
await db.insert(usersFiles).values(newUserFile1)

const newFile2: typeof files.$inferInsert = {
  name: 'file2',
  description: 'file2 description',
  createdBy: 'tindecken'
}
await db.insert(files).values(newFile2)
const newUserFile2: typeof usersFiles.$inferInsert = {
  userId: 1,
  fileId: 2,
  role: 'user'
}
await db.insert(usersFiles).values(newUserFile2)

// create category
const newCategory1: typeof categories.$inferInsert = {
  name: 'category1',
  description: 'category1 description',
  fileId: 1
}
await db.insert(categories).values(newCategory1)

const newCategory2: typeof categories.$inferInsert = {
  name: 'category2',
  description: 'category2 description',
  fileId: 1
}
await db.insert(categories).values(newCategory2)

// create papaerWorkds
const paperWork1: typeof paperWorks.$inferInsert = {
  name: 'paperWork1',
  description: 'paperWork1 description',
  categoryId: 1
}
await db.insert(paperWorks).values(paperWork1)

const paperWork2: typeof paperWorks.$inferInsert = {
  name: 'paperWork2',
  description: 'paperWork2 description',
  categoryId: 2
}
await db.insert(paperWorks).values(paperWork2)

const paperWork3: typeof paperWorks.$inferInsert = {
  name: 'paperWork3',
  description: 'paperWork3 description',
  categoryId: 1
}
await db.insert(paperWorks).values(paperWork3)

