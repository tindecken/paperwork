import { db } from './index';
import { ulid } from 'ulid';
import { usersTable, usersFilesTable, usersSettingsTable, settingsTable, documentsTable, categoriesTable, filesTable, type InsertCategory, type InsertPaperwork, paperworksTable, type InsertPaperworksCategories, paperworksCategoriesTable, type InsertFile, type InsertUsersFiles, type InsertUser } from './schema';

// truncate table before inserting new users
await db.delete(usersFilesTable);
await db.delete(usersTable);
await db.delete(usersSettingsTable);
await db.delete(settingsTable);
await db.delete(documentsTable);
await db.delete(categoriesTable);
await db.delete(filesTable);
await db.delete(paperworksTable);
await db.delete(paperworksCategoriesTable);


const user: InsertUser = {
  id: ulid(),
  name: 'Tindecken',
  userName: 'tindecken',
  email: 'tindecken@gmail.com',
  password: await Bun.password.hash('rivaldo'),
  systemRole: 'admin',
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

// PAPERWORKS
const paperwork1: InsertPaperwork = {
  id: '01J6DZDNMWTNMK97HXKWKPSNY3',
  name: 'Paperwork 1',
  description: 'This is the first paperwork of Tindecken',
  createdBy: tindeckenUser[0].userName,
};

const paperwork1Id = await db.insert(paperworksTable).values(paperwork1).returning();

// PAPERWORKS CATEGORIES

const paperworkCategory1: InsertPaperworksCategories = {
  id: ulid(),
  categoryId: category1Id[0].id,
  paperworkId: paperwork1Id[0].id,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(paperworksCategoriesTable).values(paperworkCategory1);

const hoangnguyenUser = await db.insert(usersTable).values(user2).returning();
console.log(`User Tindecken's ID: ${tindeckenUser[0].id}`);
console.log(`User Hoang Nguyen's ID: ${hoangnguyenUser[0].id}`);
