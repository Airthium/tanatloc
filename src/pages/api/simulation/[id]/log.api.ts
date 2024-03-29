/** @module Pages.API.Simulation.[id].Log */

import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/log'

/**
 * Simulation API from [id]/log
 * @param req Request
 * @param res Response
 */
const log = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default log
