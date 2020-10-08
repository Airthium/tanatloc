import getSessionId from '../session'
import auth from '../auth'

import { get } from '../../lib/simulation'
import { get as getProject } from '../../lib/project'

import Sentry from '../../lib/sentry'

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
            const simulation = await get(id, ['name', 'scheme', 'project'])

            // Check authorization
            const projectAuth = await getProject(simulation.project, [
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
      res.status(500).json({ message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ message: error.message })
    Sentry.captureException(error)
  }
}
