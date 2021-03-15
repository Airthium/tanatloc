/** @module route/user */

import getSessionId from '../session'

import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

/**
 * User API by [id]
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

  // Id
  let id = req.query.id
  if (!id) {
    // Electron
    id = req.params.id
  }

  switch (req.method) {
    case 'GET':
      try {
        const user = await UserLib.get(id, [
          'lastname',
          'firstname',
          'email',
          'avatar',
          'plugins',
          'superuser'
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
        await UserLib.update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        await UserLib.del({ id })
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
