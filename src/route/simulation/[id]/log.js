import getSessionId from '../../session'
import { checkSimulationAuth } from '../../auth'
import error from '../../error'

import SimulationLib from '@/lib/simulation'

/**
 * Check log body
 * @param {Object} body Body
 */
const checkLogBody = (body) => {
  if (!body || !body.file || typeof body.file !== 'string')
    throw error(400, 'Missing data in your request (body: { file(string) })')
}

/**
 * Simulation API log
 * @memberof module:route/simulation
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
    await checkSimulationAuth({ id: sessionId }, { id })

    if (req.method === 'POST') {
      // Check
      checkLogBody(req.body)

      // Log
      try {
        const log = await SimulationLib.getLog({ id }, req.body.file)
        res.status(200).json({ log })
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
