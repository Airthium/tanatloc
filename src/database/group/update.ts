import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Group
 * @param group Group
 * @param data Data
 */
export const update = async (
  group: { id: string },
  data: Array<IDataBaseEntry>
) => {
  await updater(tables.GROUPS, group.id, data)
}
