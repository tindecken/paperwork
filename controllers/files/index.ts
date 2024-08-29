import { Elysia } from 'elysia'
import { createFile } from './create'
import { deleteFile } from './delete'
import { selectFile } from './select'

// Notes: deleteFile not imported for safety reasons
export const filesController = new Elysia({ prefix: '/files'})
    .use(createFile)
    .use(deleteFile)
    .use(selectFile)
