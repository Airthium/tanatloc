import getSessionId from '../session'

import UserLib from '@/lib/user'
import PluginLib from '@/lib/plugin'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'POST':
      try {
        const body = req.body

        // Check authorization
        const user = await UserLib.get(sessionId, ['authorizedplugins'])
        if (!user.authorizedplugins?.includes(body.plugin.key))
          throw new Error('Unauthorized')

        await PluginLib.add({ id: sessionId }, body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'GET':
      try {
        const plugins = await PluginLib.getByUser({ id: sessionId })
        res.status(200).json({ plugins })
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        await PluginLib.update({ id: sessionId }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        await PluginLib.del({ id: sessionId }, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    default:
      const error = new Error('Method ' + req.method + ' not allowed')
      res.status(405).json({ error: true, message: error.message })
      Sentry.captureException(error)
  }
}
