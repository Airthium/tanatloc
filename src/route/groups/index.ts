/** @namespace Route.Groups */

import { IRequest, IResponse } from '..'

/**
 * Empty groups list route
 * @memberof Route.Groups
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req: IRequest, res: IResponse) => {
  // Empty route
  res.status(200).json({ groups: [] })
}
