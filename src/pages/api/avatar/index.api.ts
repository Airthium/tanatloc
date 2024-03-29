/** @module Pages.API.Avatar */

import { Request, Response } from 'express'

import route from '@/route/avatar'

/**
 * Avatar API
 * @param req Request
 * @param res Response
 */
const api = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default api
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}
