/** @module Pages.API.Noop */

import { Request, Response } from 'express'

/**
 * Noop
 * @param _ Request
 * @param res Response
 */
const noop = async (_: Request, res: Response): Promise<void> => {
  res.status(200).end()
}

export default noop
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '150mb'
    }
  }
}
