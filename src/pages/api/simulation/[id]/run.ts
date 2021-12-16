import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const run = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default run
