import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import {users} from './schema/schema'
import { eq } from 'drizzle-orm'

console.log('process.env.POSTGRES_CONNECTIONSTRING', process.env.POSTGRES_CONNECTIONSTRING)
const queryClient = postgres(process.env.POSTGRES_CONNECTIONSTRING!)

const db = drizzle(queryClient, {schema})

const user = await db.select().from(users).innerJoin(schema.files, eq(schema.files.userId, schema.users.id)).where(eq(schema.users.name, 'tindecken'))

console.log('user', user.length)