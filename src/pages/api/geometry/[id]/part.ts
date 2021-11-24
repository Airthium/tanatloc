import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/geometry/[id]/part'

/**
 * Geometry API for [id]/part
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const part = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default part
