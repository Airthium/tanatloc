/** @module Pages.API.Geometry.[id] */

import { Request, Response } from 'express'

import route from '@/route/geometry/[id]'

/**
 * Geometry API from [id]
 * @param req Request
 * @param res Response
 */
const id = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default id
