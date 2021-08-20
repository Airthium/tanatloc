/** @module route/system */

import getSessionId from '../session'
import error from '../error'

import UserLib from '@/lib/user'
import SystemLib from '@/lib/system'

/**
 * Check update body
 * @param {Object} body Body
 */
const checkUpdateBody = (body) => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * System API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        try {
          // Get
          const items = await SystemLib.get(['allowsignup', 'password'])
          res.status(200).json({ system: items })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check session
        const sessionId = await getSessionId(req, res)

        // Check superuser
        const superuser = await UserLib.get(sessionId, ['superuser'])
        if (!superuser.superuser) throw error(403, 'Access denied')

        // Check
        checkUpdateBody(req.body)

        // Update
        try {
          await SystemLib.update(req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res
      .status(err.status)
      .json({ error: true, display: err.display, message: err.message, err })
  }
}
