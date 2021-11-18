import { IRequest, IResponse } from '@/route/index.d'

import route, { IUpdateBody } from '@/route/geometry/[id]'

/**
 * Geometry API from [id]
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const id = async (
  req: IRequest<IUpdateBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default id
