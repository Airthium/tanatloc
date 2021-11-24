import { IRequest, IResponse } from '@/route/index.d'

import route, { IAddBody, IDeleteBody, IUpdateBody } from '@/route/group'

/**
 * Group API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (
  req: IRequest<IAddBody & IUpdateBody & IDeleteBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api
