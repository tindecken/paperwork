import { Elysia } from 'elysia'
import { createPaperWork } from './create'

// Notes: deleteFile not imported for safety reasons

export const paperWorksController = new Elysia({ prefix: '/paperworks'})
  .use(createPaperWork)