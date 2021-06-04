/** @module route/geometry */

import getSessionId from '../session'

import GeometryLib from '@/lib/geometry'

import Sentry from '@/lib/sentry'

/**
 * Geometry API
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
      // Add geometry
      try {
        const geometry = await GeometryLib.add(req.body)
        res.status(200).json(geometry)
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
