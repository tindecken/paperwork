import { Elysia } from 'elysia'
import { uploadDocument } from './upload'

// Notes: deleteFile not imported for safety reasons

export const documentsController = new Elysia({ prefix: '/documents'})
    .use(uploadDocument)
