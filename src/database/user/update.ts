import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.User
 * @param user User
 * @param data Data
 */
export const update = async (
  user: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.USERS, user.id, data)
}
