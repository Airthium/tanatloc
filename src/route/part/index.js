import path from 'path'

import storage from '../../../config/storage'

import getSessionId from '../session'

import { loadPart } from '../../lib/tools'

import Sentry from '../../lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    try {
      const { simulation, file } = req.body
      const part = await loadPart(
        path.join(storage.SIMULATION, simulation.id, file.partPath),
        file.part
      )
      res.status(200).json(part)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err.message })
      Sentry.captureException(err)
    }
  } else {
    const error = new Error('Method ' + req.method + ' not allowed')
    res.status(405).json({ message: error.message })
    Sentry.captureException(error)
  }
}
