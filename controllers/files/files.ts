import {Elysia, t} from "elysia"
import { userInfo } from "../../middlewares/userInfo"
import { createInsertSchema } from "drizzle-typebox"
import { files } from '../../drizzle/schema/schema'
import { usersFiles } from '../../drizzle/schema/schema'
import db from '../../drizzle/db'

const createFile = createInsertSchema(files)
const createUserFile = createInsertSchema(usersFiles)
export const filesController = (app: Elysia) => app
    .use(userInfo)
    .group('/files', (app) =>
        app
            /*
                Create new file record in table files
                Create new record in usersFiles with: role = admin
            */
            .post('/create', async ({body, userInfo}) => {
                const newFile = {
                    name: body.name,
                    description: body.description,
                }
                const file = await db
                    .insert(files)
                    .values(newFile)
                    .returning()
                const newUserFile: typeof usersFiles.$inferInsert = {
                    userId: userInfo.userId,
                    fileId: file[0].id,
                    role: 'admin',
                }
                await db.insert(usersFiles).values(newUserFile)
                return file

            }, {
                body: t.Omit(createFile, ['id', 'createdAt', 'updatedAt']),
            })
            .get('/delete', () => 'delete')
        )
    