import { IUpdateBody } from '@/route/geometry/[id]'
import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/simulation/[id]'

/**
 * Simulation API from [id]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const id = async (
  req: IRequest<IUpdateBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default id
