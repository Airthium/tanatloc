import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Organization
 * @param {Object} organization Organization `{ id }`
 */
export const del = async (organization: { id: string }): Promise<void> => {
  await deleter(tables.ORGANIZATIONS, organization.id)
}
