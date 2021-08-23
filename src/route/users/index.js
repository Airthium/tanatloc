/** @module route/users */

import getSessionId from '../session'
import error from '../error'

import UserLib from '@/lib/user'

/**
 * Users API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    // Check superuser
    const user = await UserLib.get(sessionId, ['superuser'])
    if (!user.superuser) throw error(403, 'Access denied')

    if (req.method === 'GET') {
      try {
        // Get all
        const users = await UserLib.getAll([
          'id',
          'firstname',
          'lastname',
          'email',
          'authorizedplugins',
          'superuser'
        ])
        res.status(200).json({ users })
      } catch (err) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
