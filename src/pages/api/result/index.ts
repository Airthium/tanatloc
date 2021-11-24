import { IRequest, IResponse } from '@/route/index.d'

import route, { ILoadBody } from '@/route/result'

/**
 * Result API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (req: IRequest<ILoadBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
