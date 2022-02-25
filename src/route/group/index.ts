/** @module Route.Group */

import { Request, Response } from 'express'

import { IDataBaseEntry } from '@/database/index.d'

import { session } from '../session'
import { error } from '../error'

import OrganizationLib from '@/lib/organization'
import GroupLib from '@/lib/group'

export interface IAddBody {
  organization: {
    id: string
  }
  group: {
    name: string
    users: string[]
  }
}

export interface IUpdateBody {
  group: {
    id: string
  }
  data: IDataBaseEntry[]
}

export interface IDeleteBody {
  id: string
}

/**
 * Check add body
 * @param body Body
 */
const checkAddBody = (body: IAddBody): void => {
  if (
    !body ||
    !body.organization ||
    !body.organization.id ||
    typeof body.organization.id !== 'string' ||
    !body.group ||
    !body.group.name ||
    typeof body.group.name !== 'string' ||
    !body.group.users ||
    !Array.isArray(body.group.users)
  )
    throw error(
      400,
      'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    )
}

/**
 * Check update body
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (
    !body ||
    !body.group ||
    !body.group.id ||
    typeof body.group.id !== 'string' ||
    !body.data ||
    !Array.isArray(body.data)
  )
    throw error(
      400,
      'Missing data in your request (body: { group: { id(uuid) }, data(array) })'
    )
}

/**
 * Check delete body
 * @param body Body
 */
const checkDeleteBody = (body: IDeleteBody): void => {
  if (!body || !body.id || typeof body.id !== 'string')
    throw error(400, 'Missing data in your request (body: { id(uuid) })')
}

/**
 * Check auth
 * @param organization Organization { id }
 * @param user User { id }
 */
const checkOrganizationAuth = async (
  organization: { id: string },
  user: { id: string }
): Promise<void> => {
  const organizationData = await OrganizationLib.get(organization.id, [
    'owners'
  ])
  if (!organizationData) throw error(400, 'Invalid organization identifier')

  if (!organizationData?.owners?.includes(user.id))
    throw error(403, 'Access denied')
}

/**
 * Check auth
 * @param group Group { id }
 * @param user User { id }
 */
const checkGroupAuth = async (
  group: { id: string },
  user: { id: string }
): Promise<void> => {
  const groupData = await GroupLib.get(group.id, ['organization'])
  if (!groupData) throw error(400, 'Invalid group identifier')

  const organizationData = await OrganizationLib.get(groupData.organization, [
    'owners'
  ])

  if (!organizationData?.owners?.includes(user.id))
    throw error(403, 'Access denied')
}

/**
 * Group API
 * @param req Request
 * @param res Result
 */
export default async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    switch (req.method) {
      case 'POST':
        // Check
        checkAddBody(req.body)

        const { organization, group } = req.body

        // Check auth
        await checkOrganizationAuth(organization, { id: sessionId })

        // Add
        try {
          const newGroup = await GroupLib.add(organization, group)
          res.status(200).json(newGroup)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        // Check auth
        await checkGroupAuth(req.body.group, { id: sessionId })

        // Update
        try {
          await GroupLib.update(req.body.group, req.body.data)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check
        checkDeleteBody(req.body)

        // Check administrator
        await checkGroupAuth({ id: req.body.id }, { id: sessionId })

        // Delete
        try {
          await GroupLib.del(req.body)
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
