/** @module route/avatar */

import getSessionId from '../session'
import auth from '../auth'

import AvatarLib from '@/lib/avatar'

import Sentry from '@/lib/sentry'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

/**
 * Check project auth
 * @param {Object} project Project { id }
 */
const checkProjectAuth = async (project) => {
  const projectAuth = await ProjectLib.get(
    project.id,
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
}

/**
 * Avatar API
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Add avatar
    try {
      // Check
      if (
        !req.body ||
        !req.body.file ||
        !req.body.file.name ||
        typeof req.body.file.name !== 'string' ||
        !req.body.file.uid ||
        typeof req.body.file.uid !== 'string' ||
        !req.body.file.data ||
        typeof req.body.file.data !== 'string' ||
        (req.body.project &&
          (!req.body.project.id || typeof req.body.project.id !== 'string'))
      )
        throw new Error(
          'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
        )

      const { file, project } = req.body

      // Check auth
      if (project) await checkProjectAuth(project)

      const avatar = await AvatarLib.add(
        project || { id: sessionId },
        project ? 'project' : 'user',
        file
      )
      res.status(200).json(avatar)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    console.error(error)
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
