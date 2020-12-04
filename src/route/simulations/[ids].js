import getSessionId from '../session'
import auth from '../auth'

import SimulationLib from '../../lib/simulation'
import ProjectLib from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Simulations by ids
 * @memberof module:src/route/simulations
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'GET') {
    // Get simulations list
    try {
      // Ids
      let ids = req.query.ids
      if (!ids) {
        // Electron
        ids = req.params.ids
      }

      if (ids === 'undefined' || ids === 'null') {
        res.status(200).json({ simulations: [] })
        return
      }

      const list = ids.split('&')

      const simulationsTmp = await Promise.all(
        list.map(async (id) => {
          try {
            const simulation = await SimulationLib.get(id, [
              'name',
              'scheme',
              'project'
            ])

            // Check authorization
            const projectAuth = await ProjectLib.get(simulation.project, [
              'owners',
              'users'
            ])
            if (!auth(projectAuth, sessionId)) {
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
