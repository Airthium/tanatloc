/** @module route/simulations */

import getSessionId from '../session'
import { checkProjectAuth } from '../auth'
import error from '../error'

import SimulationLib from '@/lib/simulation'

/**
 * Check get body
 * @param {Object} body Body
 */
const checkGetBody = (body) => {
  if (!body)
    throw error(400, 'Missing data in your request (body: { ids(?array) })')
}

/**
 * Simulations API
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
        res.status(200).json({ simulations: [] })
        return
      }

      // Get simulations
      const simulationsTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            // Get simulation
            const simulation = await SimulationLib.get(id, [
              'name',
              'scheme',
              'project'
            ])
            if (!simulation) throw error(400, 'Invalid simulation identifier')

            // Check authorization
            await checkProjectAuth(
              { id: sessionId },
              { id: simulation.project }
            )

            return simulation
          } catch (err) {
            console.warn(err)
            return null
          }
        })
      )

      try {
        const simulations = simulationsTmp.filter((p) => p)

        res.status(200).json({ simulations })
      } catch (err) {
        /* istanbul ignore next */
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
