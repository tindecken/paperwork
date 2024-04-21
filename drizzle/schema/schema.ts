import {relations, sql} from "drizzle-orm";
import {text, integer, sqliteTable, blob} from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text("name", { length: 150 }).notNull(),
  userName: text("userName", { length: 100 }).unique().notNull(),
  email: text('email', { length: 100 }).unique().notNull(),
  hash: text("hash").notNull(),
  salt: text("salt").notNull(),
  isActive: integer("isActive", { mode: "boolean"}).notNull().default(true),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({many}) => ({
  usersFiles: many(usersFiles),
}))

export const files = sqliteTable("files", {
   id: integer("id").primaryKey().notNull(),
   name: text("name", { length: 150 }).notNull().unique(),
   description: text("description", {length: 1000}),
  isActive: integer("isActive", { mode: "boolean"}).notNull().default(true),
  createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
   createdBy: text("createdBy", {length: 150}),
   updatedAt: text("updatedAt"),
   updatedBy: text("updatedBy", {length: 150})
})

export const filesRelations = relations(files, ({many}) => ({
  usersFiles: many(usersFiles),
}))

export const usersFiles = sqliteTable("usersFiles", {
  id: integer("id").primaryKey().notNull(),
  userId: integer("userId").references(() => users.id).notNull(),
  fileId: integer("fileId").references(() => files.id).notNull(),
  role: text("role", {enum: ["admin", "user"]}).notNull(),
  isActive: integer("isActive", { mode: "boolean"}).notNull().default(true),
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

export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey().notNull(),
    name: text("name", { length: 150 }).notNull().unique(),
    description: text("description", {length: 1000}),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt"),
    fileId: integer("fileId").references(() => files.id).notNull(),
})

export const paperWorks = sqliteTable("paperWorks", {
    id: integer("id").primaryKey().notNull(),
    categoryId: integer("categoryId").references(() => categories.id).notNull(),
    name: text("name", { length: 150 }).notNull(),
    description: text("description", {length: 1000}),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("createdBy", {length: 150}),
    updatedAt: text("updatedAt"),
    updatedBy: text("updatedBy", {length: 150}),
})

// document can be an image or a pdf, excel, word or any other format
export const documents = sqliteTable("documents", {
    id: integer("id").primaryKey().notNull(),
    fileName: text("fileName").notNull(),
    fileSize: integer("fileSize").notNull(),
    fileBlob: blob("fileBlob").notNull(),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("createdBy", {length: 150}),
})

export const paperWorksDocuments = sqliteTable("paperWorksDocuments", {
    id: integer("id").primaryKey().notNull(),
    paperWorkId: integer("paperWorkId").references(() => paperWorks.id).notNull(),
    documentId: integer("documentId").references(() => documents.id).notNull(),
})
