import getSessionId from '../session'
import auth from '../auth'

import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Simulation API by [id]
 * @memberof module:route/simulation
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
    const simulationAuth = await SimulationLib.get(id, ['project'])
    const projectAuth = await ProjectLib.get(simulationAuth.project, [
      'owners',
      'users',
      'groups',
      'workspace'
    ])
    const workspaceAuth = await WorkspaceLib.get(projectAuth.workspace, [
      'owners',
      'users',
      'groups'
    ])
    if (!(await auth(sessionId, projectAuth, workspaceAuth))) {
      res.status(401).json({ error: true, message: 'Unauthorized' })
      return
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
    return
  }

  switch (req.method) {
    case 'GET':
      // Get simulation
      try {
        const simulation = await SimulationLib.get(id, [
          'name',
          'scheme',
          'tasks'
        ])
        res.status(200).json({ simulation })
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      // Update simulation
      try {
        await SimulationLib.update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(204).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      // Delete simulation
      try {
        await SimulationLib.del(req.body, { id })
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
