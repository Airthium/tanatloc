import { IRequest, IResponse } from '@/route/index.d'

import route, { IDeleteBody, IUpdateBody } from '@/route/project/[id]'

/**
 * Project API from [id]
 * @memberof Pages.API
 * @param req Request
 * @param res Response
 */
const id = async (
  req: IRequest<IUpdateBody & IDeleteBody>,
  res: IResponse
): Promise<void> => {
  await route(req, res)
}

export default id
