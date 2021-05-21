/** @module route/simulations */

import getSessionId from '../session'
import auth from '../auth'

import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'

import Sentry from '@/lib/sentry'

/**
 * Simulations API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get simulations list
    try {
      // Ids
      let ids = req.body.ids

      if (!ids) {
        res.status(200).json({ simulations: [] })
        return
      }

      const simulationsTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            const simulation = await SimulationLib.get(id, [
              'name',
              'scheme',
              'project'
            ])

            // Check authorization
            const projectAuth = await ProjectLib.get(simulation.project, [
              'owners',
              'users',
              'groups',
              'workspace'
            ])
            const workspaceAuth = await WorkspaceLib.get(
              projectAuth.workspace,
              ['owners', 'users', 'groups']
            )
            if (!(await auth(sessionId, projectAuth, workspaceAuth))) {
              return
            }

            return simulation
          } catch (err) {
            console.warn(err)
            return null
          }
        })
      )

      const simulations = simulationsTmp.filter((p) => p)

      res.status(200).json({ simulations })
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
