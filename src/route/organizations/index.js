import getSessionId from '../session'

import OrganizationLib from '@/lib/organization'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  if (req.method === 'GET') {
    try {
      const organizations = await OrganizationLib.getByUser({ id: sessionId }, [
        'id',
        'name',
        'owners',
        'users',
        'groups'
      ])
      res.status(200).json({ organizations })
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
