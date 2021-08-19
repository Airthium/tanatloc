import getSessionId from '../session'

import OrganizationLib from '@/lib/organization'

import Sentry from '@/lib/sentry'

/**
 * Check administrator rights
 * @param {string} id Id
 */
const checkAdministrator = async (id) => {
  const organization = await OrganizationLib.get(id, ['owners'])

  if (!organization?.owners?.includes(sessionId))
    throw new Error('Unauthorized')
}

export default async (req, res) => {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'POST':
      try {
        // Check
        if (!req.body || !req.body.name || typeof req.body.name !== 'string')
          throw new Error(
            'Missing data in your request (body: { name(string) })'
          )

        // Add
        const organization = await OrganizationLib.add(
          { id: sessionId },
          req.body
        )
        res.status(200).json(organization)
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
        await checkAdministrator(req.body.id)

        // Update
        await OrganizationLib.update(
          { id: req.body.id },
          req.body.data,
          sessionId
        )
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
        await checkAdministrator(req.body.id)

        // Delete
        await OrganizationLib.del(req.body)
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
