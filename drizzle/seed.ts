import { db } from './index';
import { ulid } from 'ulid';
import {
  usersTable,
  usersSettingsTable,
  settingsTable,
  documentsTable,
  categoriesTable,
  type InsertCategory,
  type InsertPaperwork,
  paperworksTable,
  type InsertPaperworksCategories,
  paperworksCategoriesTable,
  type InsertUser,
  themesTable,
  type InsertTheme
} from './schema';

// truncate table before inserting new users
await db.delete(themesTable);
await db.delete(usersTable);
await db.delete(usersSettingsTable);
await db.delete(settingsTable);
await db.delete(documentsTable);
await db.delete(categoriesTable);
await db.delete(paperworksTable);
await db.delete(paperworksCategoriesTable);

const theme1: InsertTheme = {
  id: '01J6E4K6S5H2WYXQ5QJ9X9P6XK',
  name: 'Theme 1',
  value: 'theme1',
  description: 'This is the first theme of Tindecken',
}
const theme1Id = await db.insert(themesTable).values(theme1).returning();

const theme2: InsertTheme = {
  id: '01J6VZN9195EKD9BKG38KFHQ6X ',
  name: 'Theme 2',
  value: 'theme2',
  description: 'This is the second theme',
}
const theme2Id = await db.insert(themesTable).values(theme2).returning();

const user: InsertUser = {
  id: ulid(),
  name: 'Tindecken',
  userName: 'tindecken',
  email: 'tindecken@gmail.com',
  password: await Bun.password.hash('rivaldo'),
  avatar: '',
  themeId: theme1Id[0].id,
  isDeleted: 0,
};

const tindeckenUser = await db.insert(usersTable).values(user).returning();

// Files and userFiles section removed as those tables no longer exist

const user2: InsertUser = {
  id: ulid(),
  name: 'Hoang Nguyen',
  email: 'hoangnguyen@gmail.com',
  isEmailVerified: false,
  userType: 'free',
  avatar: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: 0,
};

// CATEGORIES

const category1: InsertCategory = {
  id: '01J6DZDNMKJXDXPYQ624QSNZQT',
  userId: tindeckenUser[0].id,
  name: 'Category 1',
  description: 'This is the first category of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const category1Id = await db.insert(categoriesTable).values(category1).returning();

const category2: InsertCategory = {
  id: '01J6HW7QKJH5DV1XNDACM1WR86',
  userId: tindeckenUser[0].id,
  name: 'Category 2',
  description: 'This is the second category of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const category2Id = await db.insert(categoriesTable).values(category2).returning();

// PAPERWORKS
const paperwork1: InsertPaperwork = {
  id: '01J6DZDNMWTNMK97HXKWKPSNY3',
  name: 'Paperwork 1',
  description: 'This is the first paperwork of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const paperwork1Id = await db.insert(paperworksTable).values(paperwork1).returning();

const paperwork2: InsertPaperwork = {
  id: ulid(),
  name: 'Paperwork 2',
  description: 'This is the second paperwork of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const paperwork2Id = await db.insert(paperworksTable).values(paperwork2).returning();

const paperwork3: InsertPaperwork = {
  id: ulid(),
  name: 'Paperwork 3',
  description: 'This is the 3rd paperwork of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const paperwork3Id = await db.insert(paperworksTable).values(paperwork3).returning();

// PAPERWORKS CATEGORIES

const paperworkCategory1: InsertPaperworksCategories = {
  id: ulid(),
  categoryId: category1Id[0].id,
  paperworkId: paperwork1Id[0].id,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(paperworksCategoriesTable).values(paperworkCategory1);

const paperworkCategory3: InsertPaperworksCategories = {
  id: ulid(),
  categoryId: category2Id[0].id,
  paperworkId: paperwork3Id[0].id,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(paperworksCategoriesTable).values(paperworkCategory3);

const paperworkCategory2: InsertPaperworksCategories = {
  id: ulid(),
  categoryId: category1Id[0].id,
  paperworkId: paperwork2Id[0].id,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(paperworksCategoriesTable).values(paperworkCategory2);

const hoangnguyenUser = await db.insert(usersTable).values(user2).returning();
