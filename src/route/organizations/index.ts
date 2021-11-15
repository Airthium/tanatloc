/** @namespace Route.Organizations */

import getSessionId from '../session'
import error from '../error'

import OrganizationLib from '@/lib/organization'

/**
 * Organizations API
 * @memberof Route.Organizations
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    if (req.method === 'GET') {
      try {
        const organizations = await OrganizationLib.getByUser(
          { id: sessionId },
          ['id', 'name', 'owners', 'users', 'groups']
        )
        res.status(200).json({ organizations })
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
