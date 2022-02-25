/** @module Pages.API.User */

import { Request, Response } from 'express'

import route from '@/route/user'

/**
 * User API
 * @param req Request
 * @param res Response
 */
const api = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default api
