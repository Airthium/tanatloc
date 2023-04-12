/** @module Pages.API.Projects */

import { Request, Response } from 'express'

import route from '@/route/projects'

/**
 * Empty projects list route
 * @param req Request
 * @param res Response
 */
const api = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default api
