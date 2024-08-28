import { db } from './index';
import { ulid } from 'ulid';
import { usersTable, InsertUser, usersFilesTable, usersSettingsTable, settingsTable, documentsTable, categoriesTable, filesTable, InsertFile, InsertUsersFiles } from './schema';

// truncate table before inserting new users
await db.delete(usersFilesTable);
await db.delete(usersTable);
await db.delete(usersSettingsTable);
await db.delete(settingsTable);
await db.delete(documentsTable);
await db.delete(categoriesTable);
await db.delete(filesTable);

const user: InsertUser = {
  id: ulid(),
  name: 'Tindecken',
  userName: 'tindecken',
  email: 'tindecken@gmail.com',
  hash: '13350f29e586ee4d86b1c9f4e3c8900ea704c15b202bbadba1a98e916072c7c150087f3ba1e1e47ae001c58fe481a1aa1c01deeb1dd2462ad2d8bd88dc16a10d',
  salt: 'ab921a2176a793495cd8a0868aab262f',
  systemRole: 'admin',
  isDeleted: 0,
};

const tindeckenUser = await db.insert(usersTable).values(user).returning();

const file1OfUser1: InsertFile = {
  id: ulid(),
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
  isSelected: 0,
  createdBy: tindeckenUser[0].userName,
};

await db.insert(usersFilesTable).values(userFile1);

const file2OfUser1: InsertFile = {
  id: ulid(),
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
  hash: '13350f29e586ee4d86b1c9f4e3c8900ea704c15b202bbadba1a98e916072c7c150087f3ba1e1e47ae001c58fe481a1aa1c01deeb1dd2462ad2d8bd88dc16a10d',
  salt: 'ab921a2176a793495cd8a0868aab262f',
  systemRole: 'user ',
  isDeleted: 0,
};

const hoangnguyenUser = await db.insert(usersTable).values(user2).returning();
console.log(`User Tindecken's ID: ${tindeckenUser[0].id}`);
console.log(`User Hoang Nguyen's ID: ${hoangnguyenUser[0].id}`);
