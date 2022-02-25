/** @module Database.Group.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param group Group
 */
export const del = async (group: { id: string }): Promise<void> => {
  await deleter(tables.GROUPS, group.id)
}
