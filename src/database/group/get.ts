/** @module Database.Group.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TGroupGet = (
  | 'name'
  | 'users'
  | 'workspaces'
  | 'projects'
  | 'organization'
)[]

export interface IGroup<T> {
  id: string
  name: T extends ['name'] ? string : never
  users: T extends ['users'] ? string[] : never[]
  workspaces?: T extends ['workspaces'] ? string[] : never[]
  projects?: T extends ['projects'] ? string[] : never[]
  organization: T extends ['organization'] ? string : never
}

/**
 * Get
 * @param id Group id
 * @param data Data
 * @returns Group
 */
export const get = async <T extends TGroupGet>(
  id: string,
  data: T
): Promise<IGroup<T>> => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}
