/** @module src/route/user */

import getSessionId from '../session'

import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

/**
 * User API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Without authorization
  if (req.method === 'POST') {
    try {
      const user = await UserLib.add(req.body)
      res.status(200).json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Check session
    const sessionId = await getSessionId(req, res)
    if (!sessionId) return

    switch (req.method) {
      case 'GET':
        try {
          const user = await UserLib.get(sessionId, [
            'lastname',
            'firstname',
            'email',
            'avatar',
            'plugins'
          ])
          res.status(200).json({ user })
        } catch (err) {
          console.error(err)
          res.status(500).json({ error: true, message: err.message })
          Sentry.captureException(err)
        }
        break
      case 'PUT':
        try {
          await UserLib.update({ id: sessionId }, req.body)
          res.status(200).end()
        } catch (err) {
          console.error(err)
          res.status(500).json({ error: true, message: err.message })
          Sentry.captureException(err)
        }
        break
      case 'DELETE':
        try {
          await UserLib.del({ id: sessionId })
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
}
