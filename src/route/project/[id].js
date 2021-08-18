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
    const projectAuth = await ProjectLib.get(
      id,
      ['owners', 'users', 'groups', 'workspace'],
      false
    )
    if (!projectAuth) throw new Error('Invalid project identifier')

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
        // Check
        if (!req.body || !Array.isArray(req.body))
          throw new Error('Missing data in your request (body(array))')

        // Update
        await ProjectLib.update({ id }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      // Delete project
      try {
        // Check
        if (!req.body || !req.body.id || typeof req.body.id !== 'string')
          throw new Error('Missing data in your request (body: { id(uuid) })')

        // Delete
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
