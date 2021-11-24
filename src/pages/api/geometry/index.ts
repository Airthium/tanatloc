import { IRequest, IResponse } from '@/route/index.d'

import route, { IAddBody } from '@/route/geometry'

/**
 * Geometry API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const api = async (req: IRequest<IAddBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default api
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '150mb'
    }
  }
}
