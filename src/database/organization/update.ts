import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Organization
 * @param organization Organization
 * @param data Data
 */
export const update = async (
  organization: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.ORGANIZATIONS, organization.id, data)
}
