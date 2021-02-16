import getSessionId from '../session'

import UserLib from '@/lib/user'
import SystemLib from '@/lib/system'

import Sentry from '@/lib/sentry'

/**
 * System API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  // Check superuser
  const superuser = await UserLib.get(sessionId, ['superuser'])
  if (!superuser.superuser) {
    res.status(500).json({ error: true, message: 'Unauthorized' })
    return
  }

  switch (req.method) {
    case 'POST':
      try {
        const items = await SystemLib.get(req.body)
        res.status(200).json(items)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        await SystemLib.update(req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    default:
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ error: true, message: error.message })
      Sentry.captureException(error)
  }
}
