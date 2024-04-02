import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import {users} from './schema/schema'
import { eq } from 'drizzle-orm'

console.log('process.env.POSTGRES_CONNECTIONSTRING', process.env.POSTGRES_CONNECTIONSTRING)
const queryClient = postgres(process.env.POSTGRES_CONNECTIONSTRING!)

const db = drizzle(queryClient, {schema})
export default db