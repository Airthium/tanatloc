/** @module route/email */

import EmailLib from '@/lib/email'
import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { type } = req.body

      if (type === 'recover') {
        const { email } = req.body

        // Check if user exists
        const existingUser = await UserLib.getBy(email, [], 'email')
        if (existingUser) EmailLib.recover(email)
        res.status(200).end()
      } else {
        // Wrong type
        const error = new Error('Type ' + type + ' not allowed')
        res.status(405).json({ error: true, message: error.message })
        Sentry.captureException(error)
      }
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
