/** @namespace Route.Organization */

import getSessionId from '../session'
import error from '../error'

import OrganizationLib from '@/lib/organization'

/**
 * Check add body
 * @memberof Route.Organization
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (!body || !body.name || typeof body.name !== 'string')
    throw error(400, 'Missing data in your request (body: { name(string) })')
}

/**
 * Check update body
 * @memberof Route.Organization
 * @param {Object} body Body
 */
const checkUpdateBody = (body) => {
  if (
    !body ||
    !body.id ||
    typeof body.id !== 'string' ||
    !body.data ||
    !Array.isArray(body.data)
  )
    throw error(
      400,
      'Missing data in your request (body: { id(uuid), data(array) })'
    )
}

/**
 * Check delete body
 * @memberof Route.Organization
 * @param {Object} body Body
 */
const checkDeleteBody = (body) => {
  if (!body || !body.id || typeof body.id !== 'string')
    throw error(400, 'Missing data in your request (body: { id(uuid) })')
}

/**
 * Check organization administrator
 * @memberof Route.Organization
 * @param {string} id Id
 */
const checkOrganizationAdministrator = async (id, user) => {
  const organization = await OrganizationLib.get(id, ['owners'])
  if (!organization) throw error(400, 'Invalid organization identifier')

  if (!organization?.owners?.includes(user.id))
    throw error(403, 'Access denied')
}

/**
 * Organization API
 * @memberof Route.Organization
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    switch (req.method) {
      case 'POST':
        // Check
        checkAddBody(req.body)

        // Add
        try {
          const organization = await OrganizationLib.add(
            { id: sessionId },
            req.body
          )
          res.status(200).json(organization)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        // Check administrator
        await checkOrganizationAdministrator(req.body.id, { id: sessionId })

        // Update
        try {
          await OrganizationLib.update(
            { id: req.body.id },
            req.body.data,
            sessionId
          )
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check
        checkDeleteBody(req.body)

        // Check administrator
        await checkOrganizationAdministrator(req.body.id, { id: sessionId })

        try {
          // Delete
          await OrganizationLib.del(req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}