import { IRequest, IResponse } from '@/route'
import { session } from '@/route/session'
import { checkSimulationAuth } from '@/route/auth'
import { error } from '@/route/error'

import SimulationLib from '@/lib/simulation'

/**
 * Simulation API stop
 * @memberof Route.Simulation
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req: IRequest, res: IResponse): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id || req.params.id // Electron uses params

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkSimulationAuth({ id: sessionId }, { id })

    if (req.method === 'GET') {
      // Tasks
      try {
        const simulation = await SimulationLib.get(id, ['tasks'])
        res.status(200).json(simulation.tasks || [])
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
