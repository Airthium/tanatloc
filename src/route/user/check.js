import getSessionId from '../session'
import { login } from '../../lib/user'

/**
 * User check API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  const user = await login(req.body)
  if (user) {
    res.status(200).json({ valid: true })
  } else {
    res.status(401).json({ valid: false })
  }
}
