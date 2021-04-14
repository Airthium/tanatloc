/** @module route/avatar */

import getSessionId from '../session'

import AvatarLib from '@/lib/avatar'

import Sentry from '@/lib/sentry'

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
      // Add avatar
      try {
        const avatar = await AvatarLib.add(
          req.body.project || { id: sessionId },
          req.body.project ? 'project' : 'user',
          req.body.file
        )
        res.status(200).json(avatar)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      // Delete avatar
      try {
        await AvatarLib.del({ id: sessionId }, req.body)
        res.status(200).end()
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
