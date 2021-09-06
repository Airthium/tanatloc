import { removeTokenCookie } from '@/auth/auth-cookies'

import Sentry from '@/lib/sentry'

/**
 * Logout API
 * @memberof module:route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    removeTokenCookie(res)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
  }
}
