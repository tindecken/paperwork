import { relations } from "drizzle-orm/relations";
import { files, categories, paperworks, documents, paperworksCategories, userFiles, users, settings, usersSettings } from "./schema";

export const categoriesRelations = relations(categories, ({one, many}) => ({
	file: one(files, {
		fields: [categories.fileId],
		references: [files.id]
	}),
	paperworksCategories: many(paperworksCategories),
}));

export const filesRelations = relations(files, ({many}) => ({
	categories: many(categories),
	userFiles: many(userFiles),
}));

export const documentsRelations = relations(documents, ({one}) => ({
	paperwork: one(paperworks, {
		fields: [documents.paperworkId],
		references: [paperworks.id]
	}),
}));

export const paperworksRelations = relations(paperworks, ({many}) => ({
	documents: many(documents),
	paperworksCategories: many(paperworksCategories),
}));

export const paperworksCategoriesRelations = relations(paperworksCategories, ({one}) => ({
	category: one(categories, {
		fields: [paperworksCategories.categoryId],
		references: [categories.id]
	}),
	paperwork: one(paperworks, {
		fields: [paperworksCategories.paperworkId],
		references: [paperworks.id]
	}),
}));

export const userFilesRelations = relations(userFiles, ({one}) => ({
	file: one(files, {
		fields: [userFiles.fileId],
		references: [files.id]
	}),
	user: one(users, {
		fields: [userFiles.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userFiles: many(userFiles),
	usersSettings: many(usersSettings),
}));

export const usersSettingsRelations = relations(usersSettings, ({one}) => ({
	setting: one(settings, {
		fields: [usersSettings.userId],
		references: [settings.id]
	}),
	user: one(users, {
		fields: [usersSettings.userId],
		references: [users.id]
	}),
}));

export const settingsRelations = relations(settings, ({many}) => ({
	usersSettings: many(usersSettings),
}));