import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update items
 * @memberof Database.System
 * @param data Data
 */
export const update = async (data: Array<IDataBaseEntry>): Promise<void> => {
  await updater(tables.SYSTEM, '', data)
}
