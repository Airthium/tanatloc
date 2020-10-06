import getSessionId from '../session'
import { get } from '../../lib/file'

import Sentry from '../../lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Get file
    try {
      const part = await get(req.body)
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
