/** @module route/simulation */

import getSessionId from '../session'

import SimulationLib from '@/lib/simulation'

import Sentry from '@/lib/sentry'

/**
 * Simulation API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'GET':
      // Emty route
      res.status(200).end()
      break
    case 'POST':
      // Add simulation
      try {
        const simulation = await SimulationLib.add(req.body)
        res.status(200).json(simulation)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    default:
      // Unauthorized method
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ error: true, message: error.message })
      Sentry.captureException(error)
  }
}
