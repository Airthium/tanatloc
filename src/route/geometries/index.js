/** @module route/simulations */

import getSessionId from '../session'
import auth from '../auth'

import GeometryLib from '@/lib/geometry'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Geometries API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get geometries list
    try {
      // Check
      if (!req.body)
        throw new Error('Missing data in your request (body: { ids(?array) })')

      // Ids
      let ids = req.body.ids

      if (!ids || !Array.isArray(ids)) {
        res.status(200).json({ geometries: [] })
        return
      }

      const geometriesTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            // Get geometry
            const geometry = await GeometryLib.get(id, [
              'name',
              'originalfilename',
              'summary',
              'project'
            ])
            if (!geometry) throw new Error('Invalid geometry identifier')

            // Check authorization
            const projectAuth = await ProjectLib.get(
              geometry.project,
              ['owners', 'users', 'groups', 'workspace'],
              false
            )
            const workspaceAuth = await WorkspaceLib.get(
              projectAuth.workspace,
              ['owners', 'users', 'groups'],
              false
            )
            if (!(await auth(sessionId, projectAuth, workspaceAuth)))
              throw new Error('Unauthorized')

            return geometry
          } catch (err) {
            console.warn(err)
            return null
          }
        })
      )

      const geometries = geometriesTmp.filter((p) => p)

      res.status(200).json({ geometries })
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
