import { WriteStream } from 'fs'
import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/project/[id]/archive'

/**
 * Project archive API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const archive = async (
  req: IRequest,
  res: IResponse & WriteStream
): Promise<void> => {
  await route(req, res)
}

export default archive
