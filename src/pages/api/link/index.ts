import { IRequest, IResponse } from '@/route/index.d'

import route, { IGetBody, IProcessBody } from '@/route/link'

/**
 * Link API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (
  req: IRequest<IGetBody & IProcessBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default api