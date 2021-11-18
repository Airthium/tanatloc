import { IRequest, IResponse } from '@/route/index.d'

import route, { IGetBody } from '@/route/geometries'

/**
 * Geometries API from [ids]
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req: IRequest<IGetBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
