/** @module Pages.API.Project.[id].UnarchiveFromServer */

import { Request, Response } from 'express'

import route from '@/route/project/[id]/unarchiveFromServer'

/**
 * Project unarchive from server API
 * @param req Request
 * @param res Response
 */
const unarchiveFromServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  await route(req, res)
}

export default unarchiveFromServer
