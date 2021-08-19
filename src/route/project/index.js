/** @module route/project */

import getSessionId from '../session'
import auth from '../auth'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'

import Sentry from '@/lib/sentry'

/**
 * Project API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'GET':
      // Empty route
      res.status(200).end()
      break
    case 'POST':
      // Add project
      try {
        // Check
        if (
          !req.body ||
          !req.body.workspace ||
          !req.body.workspace.id ||
          typeof req.body.workspace.id !== 'string' ||
          !req.body.project ||
          !req.body.project.title ||
          typeof req.body.project.title !== 'string'
        )
          throw new Error(
            'Missing data in your request (body: { workspace: { id(uuid) }, project: { title(string), description(?string) } }'
          )

        // Check auth
        const workspaceAuth = await WorkspaceLib.get(
          req.body.workspace.id,
          ['owners', 'users', 'groups'],
          false
        )
        if (!(await auth(sessionId, workspaceAuth)))
          throw new Error('Access denied')

        // Add
        const project = await ProjectLib.add({ id: sessionId }, req.body)
        res.status(200).json(project)
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
