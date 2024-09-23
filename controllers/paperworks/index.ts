import { Elysia } from 'elysia'
import { createPaperWork } from './create'
import { updatePaperWork } from './update'
import { deletePaperWork } from './delete'
import { getByFileid } from './getByFileId'
import { getById } from './getById'

// Notes: deleteFile not imported for safety reasons

export const paperworksController = new Elysia({ prefix: '/paperworks'})
  .use(createPaperWork)
  .use(updatePaperWork)
  .use(deletePaperWork)
  .use(getByFileid)
  .use(getById)