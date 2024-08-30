import { Elysia } from 'elysia'
import { createPaperWork } from './create'
import { updatePaperWork } from './update'
import { deletePaperWork } from './delete'
import { getByFileid } from './getByFileId'

// Notes: deleteFile not imported for safety reasons

export const paperworksController = new Elysia({ prefix: '/paperworks'})
  .use(createPaperWork)
  .use(updatePaperWork)
  .use(deletePaperWork)
  .use(getByFileid)