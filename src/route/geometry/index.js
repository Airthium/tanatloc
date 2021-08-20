/** @module route/geometry */

import getSessionId from '../session'
import auth from '../auth'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'
import GeometryLib from '@/lib/geometry'

import Sentry from '@/lib/sentry'

/**
 * Geometry API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'GET':
      // Emty route
      res.status(200).end()
      break
    case 'POST':
      try {
        // Check
        if (
          !req.body ||
          !req.body.project ||
          !req.body.project.id ||
          typeof req.body.project.id !== 'string' ||
          !req.body.geometry ||
          !req.body.geometry.name ||
          typeof req.body.geometry.name !== 'string' ||
          !req.body.geometry.uid ||
          typeof req.body.geometry.uid !== 'string' ||
          !req.body.geometry.buffer ||
          typeof req.body.geometry.buffer !== 'object'
        )
          throw new Error(
            'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
          )

        // Check auth
        const projectAuth = await ProjectLib.get(
          req.body.project.id,
          ['owners', 'users', 'groups', 'workspace'],
          false
        )
        if (!projectAuth) throw new Error('Invalid project identifier')

        const workspaceAuth = await WorkspaceLib.get(
          projectAuth.workspace,
          ['owners', 'users', 'groups'],
          false
        )

        if (!(await auth(sessionId, projectAuth, workspaceAuth)))
          throw new Error('Access denied')

        // Add
        const geometry = await GeometryLib.add(req.body)
        res.status(200).json(geometry)
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
