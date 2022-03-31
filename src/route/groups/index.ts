/** @module Route.Groups */

import { Request, Response } from 'express'

/**
 * Empty groups list route
 * @param _ Request
 * @param res Response
 */
export default async (_: Request, res: Response) => {
  // Empty route
  res.status(200).json({ groups: [] })
}
