import { serial, text, timestamp, pgTable, varchar, integer, customType } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  description: varchar("description", {length: 1000}),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
})

export const categories = pgTable("categories", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  description: varchar("description", {length: 1000}),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
  fileId: integer("file_id").references(() => files.id).notNull(),
})

export const paperWorks = pgTable("paperWorks", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  description: varchar("description", {length: 1000}),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
})

export const documents = pgTable("documents", {
  id: serial("id").primaryKey().notNull(),
  fileName: varchar("fileName").notNull(),
  file: text("file").notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
})

export const paperWorksDocuments = pgTable("paperWorksDocuments", {
  id: serial("id").primaryKey().notNull(),
  paperWorkId: integer("paperWork_id").references(() => paperWorks.id).notNull(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
})