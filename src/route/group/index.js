import getSessionId from '../session'

import OrganizationLib from '@/lib/organization'
import GroupLib from '@/lib/group'

import Sentry from '@/lib/sentry'

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'POST':
      try {
        // Check administrator
        const organization = await OrganizationLib.get(
          req.body.organization.id,
          ['owners']
        )
        if (!organization?.owners?.includes(sessionId)) {
          res.status(500).json({ error: true, message: 'Unauthorized' })
          return
        }

        const group = await GroupLib.add(req.body.organization, req.body.group)
        res.status(200).json(group)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'PUT':
      try {
        // Check administrator
        const group = await GroupLib.get(req.body.id, ['organization'])
        const organization = await OrganizationLib.get(group.organization, [
          'owners'
        ])
        if (!organization?.owners?.includes(sessionId)) {
          res.status(500).json({ error: true, message: 'Unauthorized' })
          return
        }

        await GroupLib.update({ id: req.body.id }, req.body.data)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: true, message: err.message })
        Sentry.captureException(err)
      }
      break
    case 'DELETE':
      try {
        // Check administrator
        const group = await GroupLib.get(req.body.id, ['organization'])
        const organization = await OrganizationLib.get(group.organization, [
          'owners'
        ])
        if (!organization?.owners?.includes(sessionId)) {
          res.status(500).json({ error: true, message: 'Unauthorized' })
          return
        }

        await GroupLib.del(req.body)
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
      break
  }
}
