/** @module route/link */

import LinkLib from '@/lib/link'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      try {
        // Check
        if (
          !req.body ||
          !req.body.id ||
          typeof req.body.id !== 'string' ||
          !req.body.data ||
          !Array.isArray(req.body.data)
        )
          throw new Error(
            'Missing data in your request (body: { id(uuid), data(array) })'
          )

        const { id, data } = req.body
        const link = await LinkLib.get(id, data)
        res.status(200).json(link)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        // Check
        if (!req.body || !req.body.id || typeof req.body.id !== 'string')
          throw new Error(
            'Missing data in your request (body: { id(uuid), data(?object) })'
          )

        const { id, data } = req.body
        await LinkLib.process(id, data)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    default:
      // Unauthorized method
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ error: true, message: error.message })
      Sentry.captureException(error)
  }
}
