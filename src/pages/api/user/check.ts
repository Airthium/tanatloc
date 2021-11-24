import { IRequest, IResponse } from '@/route/index.d'

import route, { ILoginBody } from '@/route/user/check'

/**
 * User check API
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const check = async (
  req: IRequest<ILoginBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default check
