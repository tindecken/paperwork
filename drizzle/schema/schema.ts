import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";


const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});

// export const roleEnum = pgEnum('role', ['admin', 'user'])

// export const users = sqliteTable("users", {
//   id: serial("id").primaryKey().notNull(),
//   name: varchar("name", { length: 150 }).notNull(),
//   userName: varchar("userName", { length: 100 }).unique().notNull(),
//   email: varchar('email', { length: 100 }).unique().notNull(),
//   hash: text("hash").notNull(),
//   salt: text("salt").notNull(),
//   isActive: boolean("isActive").notNull().default(true),
//   createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
// });

// export const usersRelations = relations(users, ({many}) => ({
//   usersFiles: many(usersFiles),
// }))

// export const files = sqliteTable("files", {
//   id: serial("id").primaryKey().notNull(),
//   name: varchar("name", { length: 150 }).notNull().unique(),
//   description: varchar("description", {length: 1000}),
//   createdBy: varchar("createdBy", {length: 150}),
//   createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
// })

// export const filesRelations = relations(files, ({many}) => ({
//   usersFiles: many(usersFiles),
// }))

// export const usersFiles = sqliteTable("usersFiles", {
//   id: serial("id").primaryKey().notNull(),
//   userId: integer("userId").references(() => users.id).notNull(),
//   fileId: integer("fileId").references(() => files.id).notNull(),
//   role: roleEnum("role").notNull(),
//   isSelectedAsDefault: boolean("isDefault").notNull().default(false),
//   isActive: boolean("isActive").notNull().default(true),
// })

// export const usersFilesRelations = relations(usersFiles, ({one}) => ({
//   users: one(users, {
//     fields: [usersFiles.userId],
//     references: [users.id],
//   }),
//   files: one(files, {
//     fields: [usersFiles.fileId],
//     references: [files.id],
//   }),
// }))

// export const categories = sqliteTable("categories", {
//   id: serial("id").primaryKey().notNull(),
//   name: varchar("name", { length: 150 }).notNull().unique(),
//   description: varchar("description", {length: 1000}),
//   createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
//   fileId: integer("file_id").references(() => files.id).notNull(),
// })

// export const paperWorks = sqliteTable("paperWorks", {
//   id: serial("id").primaryKey().notNull(),
//   name: varchar("name", { length: 150 }).notNull(),
//   description: varchar("description", {length: 1000}),
//   createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }),
//   categoryId: integer("category_id").references(() => categories.id).notNull(),
// })

// export const documents = sqliteTable("documents", {
//   id: serial("id").primaryKey().notNull(),
//   fileName: varchar("fileName").notNull(),
//   file: text("file").notNull(),
//   createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).defaultNow().notNull(),
// })

// export const paperWorksDocuments = sqliteTable("paperWorksDocuments", {
//   id: serial("id").primaryKey().notNull(),
//   paperWorkId: integer("paperWork_id").references(() => paperWorks.id).notNull(),
//   documentId: integer("document_id").references(() => documents.id).notNull(),
// })
