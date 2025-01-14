import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: {
    // url: "file:mypaperwork.db",
    // authToken: process.env['TURSO_AUTH_TOKEN']!,
    url: "libsql://mypaperwork-tindecken.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjU4MDE0NDIsImlkIjoiZDAyZTI2MWQtZGE3Ni00ZWVkLTg3NmEtZDY3NzY0MDNkYmU5In0.KbaMgLVtEB-IR2fW258gXniX_szkE6RgdAZaH8EbZk5C3FLmRvzHM-C7WFqwNwHExsXA69tq2kivuAnmHMllBw",
  },
});
