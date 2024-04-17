import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'

const queryClient = postgres(process.env['POSTGRES_CONNECTIONSTRING'] as string)

const db = drizzle(queryClient, {schema})
export default db