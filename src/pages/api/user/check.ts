import { Request, Response } from 'express'

import route from '@/route/user/check'

/**
 * User check API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const check = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default check
