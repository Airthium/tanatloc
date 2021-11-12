import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Group
 * @param {Object} group Group `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  group: { id: string },
  data: Array<DataBaseEntry>
) => {
  await updater(tables.GROUPS, group.id, data)
}
