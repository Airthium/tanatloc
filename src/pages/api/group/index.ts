/** @module Pages.API.Group */

import { Request, Response } from 'express'

import route from '@/route/group'

/**
 * Group API
 * @param req Request
 * @param res Response
 */
const api = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default api
