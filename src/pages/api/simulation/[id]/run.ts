import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const run = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default run
