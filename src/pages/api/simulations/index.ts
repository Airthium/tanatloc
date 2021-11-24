import { IRequest, IResponse } from '@/route/index.d'

import route, { IGetBody } from '@/route/simulations'

/**
 * Simulations API from [ids]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (req: IRequest<IGetBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
