import { IRequest, IResponse } from '@/route/index.d'

import route, { IAddBody, IUpdateBody } from '@/route/user'

/**
 * User API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (
  req: IRequest<IAddBody & IUpdateBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api
