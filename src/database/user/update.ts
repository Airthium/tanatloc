import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.User
 * @param {Object} user User `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  user: { id: string },
  data: Array<DataBaseEntry>
): Promise<void> => {
  await updater(tables.USERS, user.id, data)
}
