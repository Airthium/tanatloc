/** @module Pages.API.Project.[id].Copy */

import { Request, Response } from 'express'

import route from '@/route/project/[id]/copy'

/**
 * Project copy API
 * @param req Request
 * @param res Response
 */
const copy = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default copy
