import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
// import { createClient } from '@libsql/client';
import * as schema from './schema/schema'
const sqlite = new Database('local.sqlite');

// const queryClient = createClient({url:process.env['TURSO_DATABASE_URL']!, authToken: process.env['TURSO_AUTH_TOKEN']!})
// const db = drizzle(queryClient, {schema})

const db = drizzle(sqlite, {schema})
export default db