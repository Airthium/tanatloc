/** @module route/email */

import { PASSWORD_RECOVERY } from '@/config/email'

import EmailLib from '@/lib/email'
import UserLib from '@/lib/user'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  if (req.method === 'PUT') {
    try {
      // Check
      if (!req.body || !req.body.type || !req.body.email)
        throw new Error(
          'Missing data in your request (body: { email(string), type(string) }'
        )

      const { email, type } = req.body

      if (type === PASSWORD_RECOVERY) {
        // Check if user exists
        const existingUser = await UserLib.getBy(email, [], 'email')
        if (existingUser) await EmailLib.recover(email)
        res.status(200).end()
      } else {
        // Wrong type
        throw new Error('Type ' + type + ' not allowed')
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
