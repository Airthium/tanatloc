import getSessionId from '../session'

import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  // Check superuser
  const user = await UserLib.get(sessionId, ['superuser'])
  if (!user.superuser) {
    res.status(500).json({ error: true, message: 'Unauthorized' })
    return
  }

  if (req.method === 'GET') {
    try {
      const users = await UserLib.getAll([
        'id',
        'firstname',
        'lastname',
        'email',
        'superuser'
      ])
      res.status(200).json({ users })
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
