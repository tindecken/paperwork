import { db } from './index';
import { ulid } from 'ulid';
import {
  usersTable,
  usersFilesTable,
  usersSettingsTable,
  settingsTable,
  documentsTable,
  categoriesTable,
  filesTable,
  type InsertCategory,
  type InsertPaperwork,
  paperworksTable,
  type InsertPaperworksCategories,
  paperworksCategoriesTable,
  type InsertFile,
  type InsertUsersFiles,
  type InsertUser,
  themesTable,
  type InsertTheme
} from './schema';

// truncate table before inserting new users
await db.delete(themesTable);
await db.delete(usersFilesTable);
await db.delete(usersTable);
await db.delete(usersSettingsTable);
await db.delete(settingsTable);
await db.delete(documentsTable);
await db.delete(categoriesTable);
await db.delete(filesTable);
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
  systemRole: 'admin',
  avatar: '',
  themeId: theme1Id[0].id,
  isDeleted: 0,
};

const tindeckenUser = await db.insert(usersTable).values(user).returning();

const file1OfUser1: InsertFile = {
  id: '01J6E4K6SGQQ6JVMH1XW13ZR2W',
  name: 'File 1',
  description: 'This is the first file of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const file1Id = await db.insert(filesTable).values(file1OfUser1).returning();

const userFile1: InsertUsersFiles = {
  id: ulid(),
  userId: tindeckenUser[0].id,
  fileId: file1Id[0].id,
  role: 'admin',
  isSelected: 1,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(usersFilesTable).values(userFile1);

const file2OfUser1: InsertFile = {
  id: '01J6E4K6SWB66DM6H9HYD0JGR3',
  name: 'File 2',
  description: 'This is the second file of Tindecken',
  createdBy: tindeckenUser[0].userName,
};
const file2Id = await db.insert(filesTable).values(file2OfUser1).returning();

const userFile2: InsertUsersFiles = {
  id: ulid(),
  userId: tindeckenUser[0].id,
  fileId: file2Id[0].id,
  role: 'admin',
  isSelected: 0,
  createdBy: tindeckenUser[0].userName,
};
await db.insert(usersFilesTable).values(userFile2);

const user2: InsertUser = {
  id: ulid(),
  name: 'Hoang Nguyen',
  userName: 'hoangnguyen',
  email: 'hoangnguyen@gmail.com',
  password: await Bun.password.hash('rivaldo'),
  systemRole: 'user ',
  avatar: '',
  themeId: theme2Id[0].id,
  isDeleted: 0,
};

// CATEGORIES

const category1: InsertCategory = {
  id: '01J6DZDNMKJXDXPYQ624QSNZQT',
  fileId: file1Id[0].id,
  name: 'Category 1',
  description: 'This is the first category of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const category1Id = await db.insert(categoriesTable).values(category1).returning();

const category2: InsertCategory = {
  id: '01J6HW7QKJH5DV1XNDACM1WR86',
  fileId: file1Id[0].id,
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
console.log(`User Tindecken's ID: ${tindeckenUser[0].id}`);
console.log(`User Hoang Nguyen's ID: ${hoangnguyenUser[0].id}`);
