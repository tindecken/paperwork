import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

config({ path: '.env.local' }); // or .env.local

const client = createClient({
  url: 'file:mypaperwork.db',
  // encryptionKey: Bun.env["ENCRYPTION_KEY"]
  // url: process.env.TURSO_CONNECTION_URL!,
  // authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
