import { tables } from '@/config/db'

import { query } from '..'
import { INewGroup } from '../index.d'

/**
 * Add
 * @memberof Database.Group
 * @param {Object} organization Organization `{ id }`
 * @param {Object} group Group `{ name, users }`
 * @returns {Object} Group `{ id, name, users, organization }`
 */
export const add = async (
  organization: { id: string },
  group: { name: string; users: Array<string> }
): Promise<INewGroup> => {
  const response = await query(
    'INSERT INTO ' +
      tables.GROUPS +
      ' (name, users, organization) VALUES ($1, $2, $3) RETURNING id',
    [group.name, group.users, organization.id]
  )

  const newGroup = response.rows[0]
  newGroup && (newGroup.name = group.name)
  newGroup && (newGroup.users = group.users)
  newGroup && (newGroup.organization = organization.id)

  return newGroup
}
