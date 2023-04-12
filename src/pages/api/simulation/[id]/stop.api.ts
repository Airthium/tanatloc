/** @module Pages.API.Simulation.[id].Stop */

import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/stop'

/**
 * Simulation API from [id]/stop
 * @param req Request
 * @param res Response
 */
const stop = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default stop
