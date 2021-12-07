import { WriteStream } from 'fs'
import { IRequest, IResponse } from '@/route/index.d'

import route, { IArchiveBody } from '@/route/result/archive'

/**
 * Result archive API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const archive = async (
  req: IRequest<IArchiveBody>,
  res: IResponse & WriteStream
): Promise<void> => {
  await route(req, res)
}

export default archive