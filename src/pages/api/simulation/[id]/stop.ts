import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/stop'

/**
 * Simulation API from [id]/stop
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const stop = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default stop
