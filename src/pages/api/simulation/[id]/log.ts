import { IRequest, IResponse } from '@/route/index.d'

import route, { ILogBody } from '@/route/simulation/[id]/log'

/**
 * Simulation API from [id]/log
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const log = async (req: IRequest<ILogBody>, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default log
