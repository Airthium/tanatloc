import { Request, Response } from 'express'

import route from '@/route/geometry/[id]/part'

/**
 * Geometry API for [id]/part
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const part = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default part
