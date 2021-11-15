import { IRequest, IResponse } from '@/route'
import { logout as route } from '@/route/logout'

/**
 * Logout API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const logout = async (req: IRequest, res: IResponse): Promise<void> => {
  await route(req, res)
}

export default logout
