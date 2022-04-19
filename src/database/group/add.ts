/** @module Database.Group.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewGroup {
  id: string
  name: string
  users: string[]
  organization: string
}

/**
 * Add
 * @param organization Organization
 * @param group Group
 * @returns New group
 */
export const add = async (
  organization: { id: string },
  group: { name: string; users: string[] }
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
