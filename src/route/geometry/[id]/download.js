import getSessionId from '../../session'
import auth from '../../auth'

import GeometryLib from '@/lib/geometry'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Geometry API download
 * @memberof module:route/geometry
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
    const geometryAuth = await GeometryLib.get(id, ['project'])
    const projectAuth = await ProjectLib.get(geometryAuth.project, [
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

  if (req.method === 'GET') {
    // Download geometry
    try {
      const part = await GeometryLib.read({ id })
      res.status(200).json(part)
    } catch (err) {
      console.error(err)
      res.status(204).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
