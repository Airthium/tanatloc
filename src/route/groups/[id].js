import getSessionId from '../session'

import GroupLib from '@/lib/group'

import Sentry from '@/lib/sentry'

/**
 * Groups API [id]
 * @memberof module:route/simulation
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

  // Check
  if (!id || typeof id !== 'string') {
    const error = new Error(
      'Missing data in your request (query: { id(string) })'
    )
    console.error(error)
    res.status(500).json({ error: true, message: error.message })
    Sentry.captureException(error)
    return
  }

  if (req.method === 'GET') {
    try {
      // TODO check if user is in organization
      const groups = await GroupLib.getByOrganization(id, [
        'id',
        'name',
        'users'
      ])
      res.status(200).json({ groups })
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
