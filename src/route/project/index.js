/** @module route/project */

import getSessionId from '../session'
import { checkWorkspaceAuth } from '../auth'
import error from '../error'

import ProjectLib from '@/lib/project'

/**
 * Check add body
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (
    !body ||
    !body.workspace ||
    !body.workspace.id ||
    typeof body.workspace.id !== 'string' ||
    !body.project ||
    !body.project.title ||
    typeof body.project.title !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { workspace: { id(uuid) }, project: { title(string), description(?string) } }'
    )
}

/**
 * Project API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    switch (req.method) {
      case 'GET':
        // Empty route
        res.status(200).end()
        break
      case 'POST':
        // Check
        checkAddBody(req.body)

        const { workspace, project } = req.body

        // Check auth
        await checkWorkspaceAuth({ id: sessionId }, workspace)

        // Add
        try {
          const newProject = await ProjectLib.add(
            { id: sessionId },
            workspace,
            project
          )
          res.status(200).json(newProject)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
