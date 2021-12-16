import { Request, Response } from 'express'

import route from '@/route/result/archive'

/**
 * Result archive API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const archive = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default archive
