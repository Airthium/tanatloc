import { IRequest, IResponse } from '@/route/index.d'

import route, { IUpdateBody } from '@/route/system'

/**
 * User API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (
  req: IRequest<IUpdateBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api
