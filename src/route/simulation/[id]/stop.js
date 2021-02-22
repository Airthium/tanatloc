import getSessionId from '../../session'
import auth from '../../auth'

import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'

import Sentry from '@/lib/sentry'

/**
 * Simulation API stop
 * @memberof module:src/route/simulation
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

  // Check authorization
  try {
    const simulationAuth = await SimulationLib.get(id, ['project'])
    const projectAuth = await ProjectLib.get(simulationAuth.project, [
      'owners',
      'users'
    ])

    if (!auth(projectAuth, sessionId)) {
      res.status(401).json({ error: true, message: 'Unauthorized' })
      return
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
    return
  }

  if (req.method === 'GET') {
    // Run simulation
    try {
      await SimulationLib.stop({ id })
      res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      res.status(204).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
