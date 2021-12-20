import { Request, Response } from 'express'

import route from '@/route/user/[id]'

/**
 * user API from [id]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const id = async (req: Request, res: Response): Promise<void> => {
  await route(req, res)
}

export default id //NOSONAR
