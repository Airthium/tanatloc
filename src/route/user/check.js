import getSessionId from '../session'

import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

/**
 * User check API
 * @memberof module:route/user
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    try {
      // Check
      if (
        !req.body ||
        !req.body.email ||
        typeof req.body.email !== 'string' ||
        !req.body.password ||
        typeof req.body.password !== 'string'
      )
        throw new Error(
          'Missing data in your request (body: { email(string), password(string) })'
        )

      // Login
      const user = await UserLib.login(req.body)
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
  } else {
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
