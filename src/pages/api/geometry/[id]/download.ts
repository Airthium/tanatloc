import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/geometry/[id]/download'

/**
 * Geometry API for [id]/download
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const download = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default download
