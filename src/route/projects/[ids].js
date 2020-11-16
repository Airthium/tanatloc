import getSessionId from '../session'
import auth from '../auth'

import { get } from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Projects API
 * @memberof module:src/route/projects
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'GET') {
    // Get projects list
    try {
      // Ids
      let ids = req.query.ids
      if (!ids) {
        // Electron
        ids = req.params.ids
      }

      if (ids === 'undefined' || ids === 'null') {
        res.status(200).json({ projects: [] })
        return
      }

      const list = ids.split('&')
      const projectsTmp = await Promise.all(
        list.map(async (id) => {
          try {
            const project = await get(id, [
              'title',
              'description',
              'avatar',
              'owners',
              'users',
              'simulations'
            ])

            // Check authorization
            if (!auth(project, sessionId)) {
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
