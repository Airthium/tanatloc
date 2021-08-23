import getSessionId from '../../session'
import { checkGeometryAuth } from '../../auth'
import error from '../../error'

import GeometryLib from '@/lib/geometry'

/**
 * Geometry API download
 * @memberof module:route/geometry
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

    // Check authorization
    await checkGeometryAuth({ id: sessionId }, { id })

    if (req.method === 'GET') {
      try {
        // Download
        const part = await GeometryLib.read({ id })
        res.status(200).json(part)
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
