/** @namspace Route.Simulation */

import getSessionId from '../session'
import { checkProjectAuth } from '../auth'
import error from '../error'

import SimulationLib from '@/lib/simulation'

/**
 * Check add body
 * @memberof Route.Simulation
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (
    !body ||
    !body.project ||
    !body.project.id ||
    typeof body.project.id !== 'string' ||
    !body.simulation ||
    !body.simulation.name ||
    typeof body.simulation.name !== 'string' ||
    !body.simulation.scheme ||
    typeof body.simulation.scheme !== 'object'
  )
    throw error(
      400,
      'Missing data in your request (body: { project: { id(uuid) }, simulation: { name(string), scheme(object) } }'
    )
}

/**
 * Simulation API
 * @memberof Route.Simulation
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    switch (req.method) {
      case 'GET':
        // Emty route
        res.status(200).end()
        break
      case 'POST':
        // Check
        checkAddBody(req.body)

        const { project, simulation } = req.body

        // Check auth
        await checkProjectAuth({ id: sessionId }, { id: project.id })

        // Add
        try {
          const newSimulation = await SimulationLib.add(project, simulation)
          res.status(200).json(newSimulation)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
