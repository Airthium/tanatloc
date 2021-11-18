import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/simulation/[id]/tasks'

/**
 * Simulation API from [id]/tasks
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const tasks = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default tasks
