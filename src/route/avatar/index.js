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
        typeof req.body.file !== 'object' ||
        !req.body.file.name ||
        typeof req.body.file.name !== 'string' ||
        !req.body.file.uid ||
        typeof req.body.file.uid !== 'string' ||
        !req.body.file.data ||
        typeof req.body.file.data !== 'string' ||
        (req.body.project &&
          (typeof req.body.project !== 'object' ||
            !req.body.project.id ||
            typeof req.body.project.id !== 'string'))
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
