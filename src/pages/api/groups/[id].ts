import { IRequest, IResponse } from '@/route/index.d'

import route from '@/route/groups/[id]'

/**
 * Groups API from [id]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const id = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default id
