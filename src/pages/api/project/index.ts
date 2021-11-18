import { IRequest, IResponse } from '@/route/index.d'

import route, { IAddBody } from '@/route/project'

/**
 * Project API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req: IRequest<IAddBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
