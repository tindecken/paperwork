import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import { sql } from 'drizzle-orm'
import { users, files, usersFiles } from './schema/schema'

const queryClient = postgres(process.env.POSTGRES_CONNECTIONSTRING!)

const db = drizzle(queryClient, {schema})

//truncate tables
await db.execute(sql`TRUNCATE TABLE ${users} RESTART IDENTITY CASCADE`)
await db.execute(sql`TRUNCATE TABLE ${files} RESTART IDENTITY CASCADE`)
await db.execute(sql`TRUNCATE TABLE ${usersFiles} RESTART IDENTITY CASCADE`)

await db.insert(users).values({
  name: 'hoang',
  email: 'hoang@gmail.comm',
  username: 'hoang2',
  password: 'hoang',
})

await db.insert(users).values({
  name: 'tindecken',
  email: 'tindecken@gmail.comm',
  username: 'tindecken',
  password: 'rivaldo',
})

await db.insert(files).values({
  name: 'file1',
  description: 'file1 description',
})

await db.insert(files).values({
  name: 'file2',
  description: 'file2 description',
})

await db.insert(usersFiles).values({
  userId: 1,
  fileId: 1,
  role: 'admin',
})

await db.insert(usersFiles).values({
  userId: 1,
  fileId: 2,
  role: 'admin',
})

await db.insert(usersFiles).values({
  userId: 2,
  fileId: 2,
  role: 'admin',
})