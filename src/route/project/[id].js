import getSessionId from '../session'
import auth from '../auth'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Project API by [id]
 * @memberof module:route/project
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
    const projectAuth = await ProjectLib.get(
      id,
      ['owners', 'users', 'groups', 'workspace'],
      false
    )
    const workspaceAuth = await WorkspaceLib.get(
      projectAuth.workspace,
      ['owners', 'users', 'groups'],
      false
    )
    if (!(await auth(sessionId, projectAuth, workspaceAuth))) {
      res.status(401).json({ project: 'Unauthorized' })
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
      // Get project
      try {
        const project = await ProjectLib.get(id, [
          'title',
          'description',
          'avatar',
          'owners',
          'users',
          'geometries',
          'simulations'
        ])

        res.status(200).json({ project })
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      // Update project
      try {
        await ProjectLib.update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(204).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      // Delete project
      try {
        await ProjectLib.del(req.body, { id })
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
