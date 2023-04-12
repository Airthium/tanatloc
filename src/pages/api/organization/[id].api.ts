/** @module Pages.API.Organization.[id] */

import { Request, Response } from 'express'

import route from '@/route/organization/[id]'

/**
 * Organization id API
 * @param req Request
 * @param res Response
 */
const id = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default id
