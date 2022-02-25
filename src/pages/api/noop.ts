/** @module Pages.API.Noop */

import { Request, Response } from 'express'

/**
 * Noop
 * @param req Request
 * @param res Response
 */
const noop = async (req: Request, res: Response): Promise<void> => {
  res.status(200).end()
}

export default noop
