import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, real, blob, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const categories = sqliteTable("categories", {
	id: text("id").primaryKey().notNull(),
	fileId: text("fileId").notNull().references(() => files.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
});

export const documents = sqliteTable("documents", {
	id: text("id").primaryKey().notNull(),
	paperworkId: text("paperworkId").notNull().references(() => paperworks.id, { onDelete: "cascade" } ),
	fileName: text("fileName").notNull(),
	fileSize: real("fileSize").notNull(),
	fileBlob: blob("fileBlob").notNull(),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
});

export const files = sqliteTable("files", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
});

export const logs = sqliteTable("logs", {
	id: integer("id").primaryKey().notNull(),
	actionType: text("actionType"),
	method: text("method"),
	message: text("message"),
	oldData: text("oldData"),
	newData: text("newData"),
	actionBy: text("actionBy"),
	ipaddress: text("ipaddress"),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const paperworksCategories = sqliteTable("paperworksCategories", {
	id: text("id").primaryKey().notNull(),
	paperworkId: text("paperworkId").notNull().references(() => paperworks.id, { onDelete: "cascade" } ),
	categoryId: text("categoryId").notNull().references(() => categories.id, { onDelete: "cascade" } ),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
});

export const paperworks = sqliteTable("paperworks", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	issuedAt: integer("issuedAt"),
	price: real("price"),
	priceCurrency: text("priceCurrency"),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
});

export const settings = sqliteTable("settings", {
	id: text("id").primaryKey().notNull(),
	key: text("key").notNull(),
	value: text("value").notNull(),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
	isDeleted: integer("isDeleted").default(0).notNull(),
},
(table) => {
	return {
		keyUnique: uniqueIndex("settings_key_unique").on(table.key),
	}
});

export const userFiles = sqliteTable("userFiles", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" } ),
	role: text("role").notNull(),
	isSelected: integer("isSelected").default(0).notNull(),
	fileId: text("fileId").notNull().references(() => files.id, { onDelete: "cascade" } ),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
});

export const usersSettings = sqliteTable("usersSettings", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => settings.id, { onDelete: "cascade" } ).references(() => users.id, { onDelete: "cascade" } ),
	createdAt: text("createdAt").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	createdBy: text("createdBy"),
	updatedAt: integer("updatedAt"),
	updatedBy: text("updatedBy"),
});

export const users = sqliteTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userName: text("userName").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	systemRole: text("systemRole").default("user").notNull(),
	isDeleted: integer("isDeleted").default(0).notNull(),
},
(table) => {
	return {
		emailUnique: uniqueIndex("users_email_unique").on(table.email),
		userNameUnique: uniqueIndex("users_userName_unique").on(table.userName),
	}
});