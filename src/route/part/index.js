/** @module src/route/part */

import getSessionId from '../session'
import auth from '../auth'

import { get } from '../../lib/part'
import { get as getSimulation } from '../../lib/simulation'
import { get as getProject } from '../../lib/project'

import Sentry from '../../lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get part
    try {
      const { simulation, file } = req.body

      // Check authorization
      const simulationAuth = await getSimulation(simulation.id, ['project'])
      const projectAuth = await getProject(simulationAuth.project, [
        'owners',
        'users'
      ])
      if (!auth(projectAuth, sessionId)) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const part = await get(simulation, file)
      res.status(200).json(part)
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
