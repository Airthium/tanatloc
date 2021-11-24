import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/simulation/[id]/stop'

/**
 * Simulation API from [id]/stop
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const stop = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default stop
