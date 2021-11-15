import { tables } from '@/config/db'

import { getter } from '..'
import { IGroup } from '../index.d'

/**
 * Get
 * @memberof Database.Group
 * @param {string} id Group id
 * @param {Array} data Data
 * @returns {Object} Group `{ id, ...data }`
 */
export const get = async (id: string, data: Array<string>): Promise<IGroup> => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}
