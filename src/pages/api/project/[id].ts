import { Request, Response } from 'express'

import route from '@/route/project/[id]'

/**
 * Project API from [id]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const id = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default id
