import { getSession } from '@/auth/iron'

import { IRequest } from '.'
import error from './error'

/**
 * Session
 * @memberof Route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req: IRequest): Promise<string> => {
  try {
    const session = await getSession(req)
    if (!session || !session.id) {
      throw error(401, 'Unauthorized', false)
    }
    return session.id
  } catch (err) {
    throw error(401, 'Unauthorized', false)
  }
}
