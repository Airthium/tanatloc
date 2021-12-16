/** @module Route.Groups */

import { Request, Response } from 'express'

/**
 * Empty groups list route
 * @memberof Route.Groups
 * @param req Request
 * @param res Response
 */
export default async (req: Request, res: Response) => {
  // Empty route
  res.status(200).json({ groups: [] })
}
