/** @module src/route/avatar */

import getSessionId from '../session'
import { add, del } from '../../lib/avatar'

import Sentry from '../../lib/sentry'

/**
 * Avatar API
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'POST':
      try {
        const avatar = await add({ id: sessionId }, req.body)
        res.status(200).json(avatar)
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        await del({ id: sessionId }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
        Sentry.captureException(err)
      }
      break
    default:
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ message: error.message })
      Sentry.captureException(error)
  }
}
