/** @module Pages.API.User.Check */

import { Request, Response } from 'express'

import route from '@/route/user/check'

/**
 * User check API
 * @param req Request
 * @param res Response
 */
const check = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default check
