import getSessionId from '../../session'
import { checkSimulationAuth } from '../../auth'
import error from '../../error'

import SimulationLib from '@/lib/simulation'

/**
 * Simulation API stop
 * @memberof Route.Simulation
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    // Id
    const id = req.query.id || req.params.id // Electron uses params

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkSimulationAuth({ id: sessionId }, { id })

    if (req.method === 'GET') {
      // Stop
      try {
        await SimulationLib.stop({ id })
        res.status(200).json({ ok: true })
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
