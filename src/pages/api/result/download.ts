import { WriteStream } from 'fs'
import { IRequest, IResponse } from '@/route/index.d'

import route, { IDownloadBody } from '@/route/result/download'

/**
 * Result download API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const download = async (
  req: IRequest<IDownloadBody>,
  res: IResponse & WriteStream
): Promise<void> => {
  await route(req, res)
}

export default download
