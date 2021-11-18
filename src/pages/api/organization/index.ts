import { IRequest, IResponse } from '@/route/index.d'

import route, { IAddBody, IDeleteBody, IUpdateBody } from '@/route/organization'

/**
 * Organization API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (
  req: IRequest<IAddBody & IUpdateBody & IDeleteBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api
