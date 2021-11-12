import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update items
 * @memberof Database.System
 * @param {Object} data Data `[{ key, value }, ...]`
 */
export const update = async (data: Array<DataBaseEntry>): Promise<void> => {
  await updater(tables.SYSTEM, '', data)
}
