import getSessionId from '../session'
import auth from '../auth'

import { get, update, del } from '../../lib/simulation'
import { get as getProject } from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Simulation API by [id]
 * @memberof module:src/route/simulation
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

  // Check authorization
  try {
    const simulationAuth = await get(id, ['project'])
    const projectAuth = await getProject(simulationAuth.project, [
      'owners',
      'users'
    ])

    if (!auth(projectAuth, sessionId)) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
    Sentry.captureException(err)
    return
  }

  switch (req.method) {
    case 'GET':
      // Get simulation
      try {
        const simulation = await get(id, ['name', 'scheme'])
        res.status(200).json({ simulation })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      // Update simulation
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
      // Delete simulation
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
      // Unauthorized method
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ message: error.message })
      Sentry.captureException(error)
  }
}
