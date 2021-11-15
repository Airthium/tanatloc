import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Organization
 * @param {Object} organization Organization `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  organization: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.ORGANIZATIONS, organization.id, data)
}
