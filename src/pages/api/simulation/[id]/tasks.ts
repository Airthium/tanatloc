import { Request, Response } from 'express'

import route from '@/route/simulation/[id]/tasks'

/**
 * Simulation API from [id]/tasks
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const tasks = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default tasks
