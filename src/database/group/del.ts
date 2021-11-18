import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Group
 * @param group Group
 */
export const del = async (group: { id: string }): Promise<void> => {
  await deleter(tables.GROUPS, group.id)
}
