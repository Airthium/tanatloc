/** @module Pages.API.Groups.[id] */

import { Request, Response } from 'express'

import route from '@/route/groups/[id]'

/**
 * Groups API from [id]
 * @param req Request
 * @param res Response
 */
const id = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default id
