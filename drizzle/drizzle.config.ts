import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: 'file:mypaperwork.db',
    authToken: process.env['TURSO_AUTH_TOKEN']!,
  },
});
