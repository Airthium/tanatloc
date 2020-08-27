import getSessionId from '../session'
import { get } from '../../lib/user'

/**
 * User API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  // Check session
  const sessionId = await getSessionId(req)
  if (!sessionId) return

  const user = await get(sessionId)
  res.status(200).json({ user })
}
