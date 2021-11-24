import { IRequest, IResponse } from '@/route/index.d'

import route, { ICheckBody } from '@/route/email'

/**
 * Email API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (
  req: IRequest<ICheckBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api
