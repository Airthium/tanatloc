/** @module src/route/project */

import getSessionId from '../session'
import { add } from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Project API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    try {
      const project = await add({ id: sessionId }, req.body)
      res.status(200).json(project)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err.message })
      Sentry.captureException(err)
    }
  } else {
    const err = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ message: err.message })
    Sentry.captureException(err)
  }
}
