import { tables } from '@/config/db'

import { getter } from '..'

export type Group = {
  id: string
  name?: string
  users?: Array<string>
  workspaces?: Array<string>
  projects?: Array<string>
  organization?: string
}

/**
 * Get
 * @memberof Database.Group
 * @param {string} id Group id
 * @param {Array} data Data
 * @returns {Object} Group `{ id, ...data }`
 */
export const get = async (id: string, data: Array<string>): Promise<Group> => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}
