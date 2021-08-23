import getSessionId from '../session'
import { checkOrganizationAuth } from '../auth'
import error from '../error'

import GroupLib from '@/lib/group'

/**
 * Groups API [id]
 * @memberof module:route/groups
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    // Id
    const id = req.query.id || req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    if (req.method === 'GET') {
      // Check auth
      await checkOrganizationAuth({ id: sessionId }, { id })

      try {
        // Get
        const groups = await GroupLib.getByOrganization(id, [
          'id',
          'name',
          'users'
        ])
        res.status(200).json({ groups })
      } catch (err) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true })
  }
}
