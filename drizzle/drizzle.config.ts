import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema/schema.ts',
  driver: 'better-sqlite',
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env['TURSO_DATABASE_URL']!,
  }
})