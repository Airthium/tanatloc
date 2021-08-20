import getSessionId from '../session'
import auth from '../auth'

import GeometryLib from '@/lib/geometry'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Geometry API by [id]
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

  // Check
  if (!id || typeof id !== 'string') {
    const error = new Error(
      'Missing data in your request (query: { id(string) })'
    )
    console.error(error)
    res.status(500).json({ error: true, message: error.message })
    Sentry.captureException(error)
    return
  }

  // Check authorization
  try {
    const geometryAuth = await GeometryLib.get(id, ['project'])
    if (!geometryAuth) throw new Error('Invalid geometry identifier')

    const projectAuth = await ProjectLib.get(
      geometryAuth.project,
      ['owners', 'users', 'groups', 'workspace'],
      false
    )

    const workspaceAuth = await WorkspaceLib.get(
      projectAuth.workspace,
      ['owners', 'users', 'groups'],
      false
    )

    if (!(await auth(sessionId, projectAuth, workspaceAuth)))
      throw new Error('Access denied')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
    return
  }

  switch (req.method) {
    case 'PUT':
      try {
        // Check
        if (
          !req.body ||
          typeof req.body !== 'object' ||
          !Array.isArray(req.body)
        )
          throw new Error('Missing data in your request (body(array))')

        // Update
        await GeometryLib.update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        // Delete
        await GeometryLib.del({ id })
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
