/** @module route/result */

import getSessionId from '../session'

import ResultLib from '@/lib/result'

import Sentry from '@/lib/sentry'

/**
 * Result API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Load result
    try {
      // Check
      if (
        !req.body ||
        !req.body.simulation ||
        typeof req.body.simulation !== 'object' ||
        !req.body.simulation.id ||
        typeof req.body.simulation.id !== 'string' ||
        !req.body.result ||
        typeof req.body.result !== 'object' ||
        !req.body.result.originPath ||
        typeof req.body.result.originPath !== 'string' ||
        !req.body.result.glb ||
        typeof req.body.result.glb !== 'string'
      )
        throw new Error(
          'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string) } }'
        )

      // Load
      const result = await ResultLib.load(req.body)
      res.status(200).json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
