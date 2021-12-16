import { Request, Response } from 'express'

import { logout as route } from '@/route/logout'

/**
 * Logout API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const logout = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default logout
