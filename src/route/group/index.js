import getSessionId from '../session'

import OrganizationLib from '@/lib/organization'
import GroupLib from '@/lib/group'

import Sentry from '@/lib/sentry'

const checkAdministrator0 = async (organization, user) => {
  const organizationData = await OrganizationLib.get(organization.id, [
    'owners'
  ])
  if (!organizationData?.owners?.includes(user.id)) {
    res.status(500).json({ error: true, message: 'Unauthorized' })
    return false
  }

  return true
}

const checkAdministrator1 = async (group, user) => {
  const groupData = await GroupLib.get(group.id, ['organization'])
  const organizationData = await OrganizationLib.get(groupData.organization, [
    'owners'
  ])
  if (!organizationData?.owners?.includes(user.id)) {
    res.status(500).json({ error: true, message: 'Unauthorized' })
    return false
  }

  return true
}

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'POST':
      try {
        // Check
        if (
          !req.body ||
          !req.body.organization ||
          typeof req.body.organization !== 'object' ||
          !req.body.organization.id ||
          typeof req.body.organization.id !== 'string' ||
          !req.body.group ||
          typeof req.body.group !== 'object' ||
          !req.body.group.name ||
          typeof req.body.group.name !== 'string' ||
          !req.body.group.users ||
          !Array.isArray(req.body.group.users)
        )
          throw new Error(
            'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string) } })'
          )

        // Check administrator
        if (
          !(await checkAdministrator0(
            { id: req.body.organization.id },
            { id: sessionId }
          ))
        )
          throw new Error('Unauthorized')

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

        // Check administrator
        if (
          !(await checkAdministrator1({ id: req.body.id }, { id: sessionId }))
        )
          throw new Error('Unauthorized')

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
        // Check
        if (!req.body || !req.body.id || typeof req.body.id !== 'string')
          throw new Error('Missing data in your request (body: { id(uuid) })')

        // Check administrator
        if (
          !(await checkAdministrator1({ id: req.body.id }, { id: sessionId }))
        )
          throw new Error('Unauthorized')

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
