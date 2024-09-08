import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: Bun.env['TURSO_CONNECTION_URL']!,
    authToken: Bun.env['TURSO_AUTH_TOKEN']!,
  },
});
