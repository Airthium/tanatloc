import getSessionId from '../session'
import { login } from '../../lib/user'

import Sentry from '../../lib/sentry'

/**
 * User check API
 * @memberof module:src/route/user
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  try {
    const user = await login(req.body)
    if (user) {
      res.status(200).json({ valid: true })
    } else {
      res.status(401).json({ valid: false })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
  }
}
