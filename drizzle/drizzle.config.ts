import { defineConfig } from 'drizzle-kit'
console.log('TURSO_DATABASE_URL', process.env['TURSO_DATABASE_URL'])
export default defineConfig({
  schema: './drizzle/schema/schema.ts',
  driver: 'better-sqlite',
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env['TURSO_DATABASE_URL']!
  }
})