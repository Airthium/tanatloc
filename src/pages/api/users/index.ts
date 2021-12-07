import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/users'

/**
 * Users API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api