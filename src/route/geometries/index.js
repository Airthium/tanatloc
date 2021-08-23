/** @module route/geometries */

import getSessionId from '../session'
import { checkProjectAuth } from '../auth'
import error from '../error'

import GeometryLib from '@/lib/geometry'

/**
 * Check get body
 * @param {Object} body Body
 */
const checkGetBody = (body) => {
  if (!body)
    throw error(400, 'Missing data in your request (body: { ids(?array) })')
}

/**
 * Geometries API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    if (req.method === 'POST') {
      // Check
      checkGetBody(req.body)

      // Ids
      const ids = req.body.ids

      if (!ids || !Array.isArray(ids)) {
        res.status(200).json({ geometries: [] })
        return
      }

      // Get geometries
      const geometriesTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            // Get geometry
            const geometry = await GeometryLib.get(id, [
              'name',
              'originalfilename',
              'summary',
              'project'
            ])
            if (!geometry) throw error(400, 'Invalid geometry identifier')

            // Check authorization
            await checkProjectAuth({ id: sessionId }, { id: geometry.project })

            return geometry
          } catch (err) {
            console.warn(err)
          }
        })
      )

      try {
        // Filter
        const geometries = geometriesTmp.filter((p) => p)

        res.status(200).json({ geometries })
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
