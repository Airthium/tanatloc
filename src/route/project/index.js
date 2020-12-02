/** @module src/route/project */

import getSessionId from '../session'

import ProjectLib from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Project API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'GET':
      // Empty route
      res.status(200).end()
      break
    case 'POST':
      // Add project
      try {
        const project = await ProjectLib.add({ id: sessionId }, req.body)
        res.status(200).json(project)
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
