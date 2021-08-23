/** @module route/result */

import getSessionId from '../session'
import { checkSimulationAuth } from '../auth'
import error from '../error'

import ResultLib from '@/lib/result'

/**
 * Check load body
 * @param {Object} body Body
 */
const checkLoadBody = (body) => {
  if (
    !body ||
    !body.simulation ||
    !body.simulation.id ||
    typeof body.simulation.id !== 'string' ||
    !body.result ||
    !body.result.originPath ||
    typeof body.result.originPath !== 'string' ||
    !body.result.glb ||
    typeof body.result.glb !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string) } }'
    )
}

/**
 * Result API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    if (req.method === 'POST') {
      // Load result
      try {
        // Check
        checkLoadBody(req.body)

        const { simulation, result } = req.body

        // Check auth
        await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

        // Load
        const data = await ResultLib.load(simulation, result)
        res.status(200).json(data)
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
