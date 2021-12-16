import { Request, Response } from 'express'

import route from '@/route/geometry/[id]/download'

/**
 * Geometry API for [id]/download
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const download = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default download
