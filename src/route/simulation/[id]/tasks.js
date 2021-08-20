import getSessionId from '../../session'
import auth, { checkSimulationAuth } from '../../auth'
import error from '../error'

import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Simulation API stop
 * @memberof module:route/simulation
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
    res
      .status(err.status)
      .json({ error: true, display: err.display, message: err.message, err })
  }
}
