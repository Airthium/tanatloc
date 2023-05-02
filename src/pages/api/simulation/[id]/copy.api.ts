/** @module Pages.API.Simulation.[id].Copy */

import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/copy'

/**
 * Simulation API from [id]/copy
 * @param req Request
 * @param res Response
 */
const copy = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default copy
