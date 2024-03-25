import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema/schema.ts',
  driver: 'pg',
  out: "./drizzle/migrations",
  dbCredentials: {
    connectionString: process.env.POSTGRES_CONNECTIONSTRING || 'postgresql://postgres:postgres@localhost',
  },
  verbose: true,
  strict: true,
})