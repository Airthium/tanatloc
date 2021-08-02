/** @module route/avatar */

import getSessionId from '../session'

import AvatarLib from '@/lib/avatar'

import Sentry from '@/lib/sentry'

/**
 * Avatar API
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'POST') {
    // Add avatar
    try {
      // Check
      if (
        !req.body ||
        !req.body.file ||
        !req.body.file.name ||
        !req.body.file.uid ||
        !req.body.file.data
      )
        throw new Error(
          'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
        )

      const avatar = await AvatarLib.add(
        req.body.project || { id: sessionId },
        req.body.project ? 'project' : 'user',
        req.body.file
      )
      res.status(200).json(avatar)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: true, message: err.message })
      Sentry.captureException(err)
    }
  } else {
    // Unauthorized method
    const error = new Error('Method ' + req.method + ' not allowed')
    console.error(error)
    res.status(405).json({ error: true, message: error.message })
    Sentry.captureException(error)
  }
}
