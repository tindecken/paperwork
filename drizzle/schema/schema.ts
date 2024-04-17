import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable, varchar, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'user'])

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  userName: varchar("userName", { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  hash: text("hash").notNull(),
  salt: text("salt").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
});

export const usersRelations = relations(users, ({many}) => ({
  usersFiles: many(usersFiles),
}))

export const files = pgTable("files", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull().unique(),
  description: varchar("description", {length: 1000}),
  createdBy: varchar("createdBy", {length: 150}),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
})

export const filesRelations = relations(files, ({many}) => ({
  usersFiles: many(usersFiles),
}))

export const usersFiles = pgTable("usersFiles", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("userId").references(() => users.id).notNull(),
  fileId: integer("fileId").references(() => files.id).notNull(),
  role: roleEnum("role").notNull(),
  isSelectedAsDefault: boolean("isDefault").notNull().default(false),
  isActive: boolean("isActive").notNull().default(true),
})

export const usersFilesRelations = relations(usersFiles, ({one}) => ({
  users: one(users, {
    fields: [usersFiles.userId],
    references: [users.id],
  }),
  files: one(files, {
    fields: [usersFiles.fileId],
    references: [files.id],
  }),
}))

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
