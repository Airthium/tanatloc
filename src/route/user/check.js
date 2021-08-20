import getSessionId from '../session'
import error from '../error'

import UserLib from '@/lib/user'

/**
 * Check login body
 * @memberof module:route/user
 * @param {Object} body Body
 */
const checkLoginBody = (body) => {
  if (
    !body ||
    !body.email ||
    typeof body.email !== 'string' ||
    !body.password ||
    typeof body.password !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { email(string), password(string) })'
    )
}

/**
 * User check API
 * @memberof module:route/user
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    await getSessionId(req, res)

    if (req.method === 'POST') {
      // Check
      checkLoginBody(req.body)

      // Login
      try {
        const user = await UserLib.login(req.body)
        if (user) {
          res.status(200).json({ valid: true })
        } else {
          res.status(401).json({ valid: false })
        }
      } catch (err) {
        throw err(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res
      .status(err.status)
      .json({ error: true, display: err.display, message: err.message, err })
  }
}
