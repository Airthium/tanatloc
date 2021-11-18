import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Organization
 * @param organization Organization
 */
export const del = async (organization: { id: string }): Promise<void> => {
  await deleter(tables.ORGANIZATIONS, organization.id)
}
