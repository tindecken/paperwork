import {Elysia, t} from "elysia"
import { userInfo } from "../../middlewares/userInfo"
import { createInsertSchema } from "drizzle-typebox"
import { files } from '../../drizzle/schema/schema'
import { usersFiles } from '../../drizzle/schema/schema'
import { and, eq } from 'drizzle-orm'
import db from '../../drizzle/db'
import type { GenericResponseInterface } from "../../models/GenericResponseInterface"

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
                const res: GenericResponseInterface = {
                    success: true,
                    message: `Create file ${file[0].name} successfully!`,
                    data: file[0]
                }
                return res
            }, {
                body: t.Omit(createFile, ['id', 'createdAt', 'updatedAt']),
            })
            .get('/delete/:id', async ({params: { id }, userInfo, set}) => {
                console.log('id', id)
                // check user has permission to delete or not
                // if(userInfo.role !== 'admin') {
                //     set.status = 403
                //     throw new Error('You are not allowed to delete this file!')
                // }
                // Delete userFile and file
                const userFile = await db.query.usersFiles.findFirst({
                    where: and(eq(usersFiles.fileId, id), eq(usersFiles.userId, userInfo.userId))
                })
                if (userFile) {
                    console.log('userFile', userFile)
                    return {userFile}
                }
                throw new Error(`There is no file with id: ${id}`)
            }, {
                params: t.Object({
                    id: t.Numeric()
                })
            })
        )
    