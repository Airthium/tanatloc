/** @module Pages.API.Project.[id].Archive */

import { Request, Response } from 'express'

import route from '@/route/project/[id]/archive'

/**
 * Project archive API
 * @param req Request
 * @param res Response
 */
const archive = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default archive
