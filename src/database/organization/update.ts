import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Organization
 * @param {Object} organization Organization `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  organization: { id: string },
  data: Array<DataBaseEntry>
): Promise<void> => {
  await updater(tables.ORGANIZATIONS, organization.id, data)
}
