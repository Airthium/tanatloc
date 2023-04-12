/** @module Pages.API.Download */

import { Request, Response } from 'express'

import route from '@/route/result/download'

/**
 * Result download API
 * @param req Request
 * @param res Response
 */
const download = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default download
