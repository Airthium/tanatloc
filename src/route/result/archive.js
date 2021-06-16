import getSessionId from '../session'

import ResultLib from '@/lib/result'

import Sentry from '@/lib/sentry'

/**
 * Result archive API
 * @memberof module:route/result
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Add geometry
    try {
      res.setHeader('Content-Type', 'application/zip')
      const archive = await ResultLib.archive(req.body)
      archive.pipe(res)
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
