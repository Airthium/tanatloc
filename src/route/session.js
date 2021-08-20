import { getSession } from '@/auth/iron'

import error from './error'

/**
 * Session
 * @memberof module:route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
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
