/** @module route/projects */

import getSessionId from '../session'
import auth from '../auth'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Projects API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get projects list
    try {
      // Ids
      const ids = req.body.ids

      if (!ids) {
        res.status(200).json({ projects: [] })
        return
      }

      console.log(ids)

      const projectsTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            const project = await ProjectLib.get(id, [
              'title',
              'description',
              'avatar',
              'owners',
              'users',
              'groups',
              'simulations',
              'workspace'
            ])
            const workspaceAuth = await WorkspaceLib.get(project.workspace, [
              'owners',
              'users',
              'groups'
            ])
            if (!(await auth(sessionId, project, workspaceAuth))) {
              return
            }

            return project
          } catch (err) {
            console.warn(err)
            return null
          }
        })
      )

      const projects = projectsTmp.filter((p) => p)

      res.status(200).json({ projects })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
