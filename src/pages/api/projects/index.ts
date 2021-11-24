import { IRequest, IResponse } from '@/route/index.d'

import route, { IGetBody } from '@/route/projects'

/**
 * Empty projects list route
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (req: IRequest<IGetBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
