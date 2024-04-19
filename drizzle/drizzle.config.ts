import { defineConfig } from 'drizzle-kit'

console.log('TURSO_DATABASE_URL', process.env['TURSO_DATABASE_URL'])
console.log('TURSO_DATABASE_URL', process.env['TURSO_AUTH_TOKEN'])
export default defineConfig({
  schema: './drizzle/schema/schema.ts',
  driver: 'turso',
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env['TURSO_DATABASE_URL']!,
    authToken: process.env['TURSO_AUTH_TOKEN']!,
  }
})