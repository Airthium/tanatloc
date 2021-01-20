/** @module src/route/file */

import getSessionId from '../session'
import auth from '../auth'

import FileLib from '@/lib/file'
import SimulationLib from '@/lib/simulation'
import ProjectLib from '@/lib/project'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get file
    try {
      const { simulation, file } = req.body

      // Check authorization
      const simulationAuth = await SimulationLib.get(simulation.id, ['project'])
      const projectAuth = await ProjectLib.get(simulationAuth.project, [
        'owners',
        'users'
      ])
      if (!auth(projectAuth, sessionId)) {
        res.status(401).json({ error: true, message: 'Unauthorized' })
        return
      }

      const part = await FileLib.get(simulation, file)
      res.status(200).json(part)
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
