/** @module route/email */

import error from '../error'

import { PASSWORD_RECOVERY } from '@/config/email'

import EmailLib from '@/lib/email'
import UserLib from '@/lib/user'

/**
 * Check send body
 * @param {Object} body Body
 */
const checkSendBody = (body) => {
  if (
    !body ||
    !body.type ||
    typeof body.type !== 'string' ||
    !body.email ||
    typeof body.email !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { email(string), type(string) }'
    )
}

/**
 * Email API
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (req, res) => {
  try {
    if (req.method === 'PUT') {
      // Check
      checkSendBody(req.body)

      const { email, type } = req.body

      if (type === PASSWORD_RECOVERY) {
        try {
          // Check if user exists
          const existingUser = await UserLib.getBy(email, [], 'email')

          // Recover
          if (existingUser) await EmailLib.recover(email)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
      } else {
        // Wrong type
        throw error(400, 'Type ' + type + ' not allowed')
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
