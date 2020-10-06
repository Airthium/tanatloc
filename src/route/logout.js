import { removeTokenCookie } from '../auth/auth-cookies'

import Sentry from '../lib/sentry'

/**
 * Logout API
 * @memberof module:src/route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    removeTokenCookie(res)
    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
    Sentry.captureException(err)
  }
}
