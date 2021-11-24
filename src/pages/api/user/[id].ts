import { IRequest, IResponse } from '@/route/index.d'
import { IUpdateBody } from '@/route/user'

import route from '@/route/user/[id]'

/**
 * user API from [id]
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
