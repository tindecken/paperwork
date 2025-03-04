import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

config({ path: '.env.local' });

const client = createClient({
  url: 'libsql://mypaperwork-tindecken.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjU4MDE0NDIsImlkIjoiZDAyZTI2MWQtZGE3Ni00ZWVkLTg3NmEtZDY3NzY0MDNkYmU5In0.KbaMgLVtEB-IR2fW258gXniX_szkE6RgdAZaH8EbZk5C3FLmRvzHM-C7WFqwNwHExsXA69tq2kivuAnmHMllBw',
});

export const db = drizzle(client, { schema });
