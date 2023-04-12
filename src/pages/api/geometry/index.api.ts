/** @module Pages.API.Geometry */

import { Request, Response } from 'express'

import route from '@/route/geometry'

/**
 * Geometry API
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
      sizeLimit: '150mb'
    }
  }
}
