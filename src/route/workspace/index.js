/** @module src/route/workspace */

import getSessionId from '../session'
import auth from '../auth'

import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Workspace API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  /**
   * Check authorization
   * @param {Object} workspace Workspace { id }
   */
  const checkAuth = async (workspace) => {
    const workspaceAuth = await WorkspaceLib.get(workspace.id, [
      'owners',
      'users',
      'groups'
    ])

    if (!(await auth(sessionId, workspaceAuth))) {
      throw new Error('Access denied')
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const workspaces = await WorkspaceLib.getByUser({ id: sessionId })
        res.status(200).json({ workspaces })
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'POST':
      try {
        const workspace = await WorkspaceLib.add({ id: sessionId }, req.body)
        res.status(200).json(workspace)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        const { workspace, data } = req.body
        // Check authorization
        await checkAuth(workspace)

        await WorkspaceLib.update(workspace, data)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(204).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        const workspace = req.body
        // Check authorization
        await checkAuth(workspace)

        await WorkspaceLib.del({ id: sessionId }, req.body)
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
