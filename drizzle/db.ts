import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema/schema'

const queryClient = createClient({url:process.env['TURSO_DATABASE_URL']!, authToken: process.env['TURSO_AUTH_TOKEN']!})

const db = drizzle(queryClient, {schema})
export default db