import { Elysia } from 'elysia'
import { createPaperWork } from './create'
import { updatePaperWork } from './update'
import { deletePaperWork } from './delete'

// Notes: deleteFile not imported for safety reasons

export const paperWorksController = new Elysia({ prefix: '/paperworks'})
  .use(createPaperWork)
  .use(updatePaperWork)
  .use(deletePaperWork)