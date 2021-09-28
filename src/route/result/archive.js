import getSessionId from '../session'
import { checkSimulationAuth } from '../auth'
import error from '../error'

import ResultLib from '@/lib/result'

/**
 * Check archive body
 * @memberof module:route/result
 * @param {Object} body Body
 */
const checkArchiveBody = (body) => {
  if (
    !body ||
    !body.simulation ||
    !body.simulation.id ||
    typeof body.simulation.id !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { simulation: { id(uuid) } }'
    )
}

/**
 * Result archive API
 * @memberof module:route/result
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    if (req.method === 'POST') {
      // Check
      checkArchiveBody(req.body)

      const { simulation } = req.body

      // Check auth
      await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

      try {
        // Archive
        res.setHeader('Content-Type', 'application/zip')
        const archive = await ResultLib.archive(simulation)
        archive.pipe(res)
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
