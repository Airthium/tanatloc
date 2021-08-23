/** @module route/workspace */

import getSessionId from '../session'
import { checkWorkspaceAuth } from '../auth'
import error from '../error'

import WorkspaceLib from '@/lib/workspace'

/**
 * Check add body
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (!body || !body.name || typeof body.name !== 'string')
    throw error(400, 'Missing data in your request (body: { name(string) })')
}

/**
 * Check update body
 * @param {Object} body Body
 */
const checkUpdateBody = (body) => {
  if (
    !body ||
    !body.workspace ||
    !body.workspace.id ||
    typeof body.workspace.id !== 'string' ||
    !body.data ||
    !Array.isArray(body.data)
  )
    throw error(
      400,
      'Missing data in your request (body: { workspace: { id(uuid) }, data(array) })'
    )
}

/**
 * Check delete body
 * @param {Object} body Body
 */
const checkDeleteBody = (body) => {
  if (!body || !body.id || typeof body.id !== 'string')
    throw error(400, 'Missing data in your request (body: { id(uuid) })')
}

/**
 * Workspace API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    switch (req.method) {
      case 'GET':
        // Get
        try {
          const workspaces = await WorkspaceLib.getByUser({ id: sessionId })
          res.status(200).json({ workspaces })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'POST':
        // Check
        checkAddBody(req.body)

        // Add
        try {
          const newWorkspace = await WorkspaceLib.add(
            { id: sessionId },
            req.body
          )
          res.status(200).json(newWorkspace)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        const { workspace, data } = req.body

        // Check authorization
        await checkAuth(workspace)

        // Update
        try {
          await WorkspaceLib.update(workspace, data)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check
        checkDeleteBody(req.body)

        // Check authorization
        await checkWorkspaceAuth({ id: sessionId }, req.body)

        // Delete
        try {
          await WorkspaceLib.del({ id: sessionId }, req.body)
          res.status(200).end()
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
