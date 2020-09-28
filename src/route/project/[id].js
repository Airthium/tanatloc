import getSessionId from '../session'
import { get, update, del } from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Project API by [id]
 * @memberof module:src/route/project
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  // Id
  let id = req.query.id
  if (!id) {
    // Electron
    id = req.params.id
  }

  switch (req.method) {
    case 'GET':
      try {
        const project = await get(id, [
          'title',
          'description',
          'avatar',
          'owners',
          'users',
          'simulations'
        ])
        res.status(200).json({ project })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        await update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(204).json({ message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        await del(req.body, { id })
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
