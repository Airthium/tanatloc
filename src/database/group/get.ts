/** @module Database.Group.Get */

import { IGroup } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id Group id
 * @param data Data
 * @returns Group
 */
export const get = async (id: string, data: Array<string>): Promise<IGroup> => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}
