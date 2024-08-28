import { Elysia } from 'elysia'
import { createFile } from './create'
import { deleteFile } from './delete'

// Notes: deleteFile not imported for safety reasons
export const filesController = new Elysia({ prefix: '/files'})
    .use(createFile)
    .use(deleteFile)
