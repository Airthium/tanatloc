/** @module Database.Organization.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param organization Organization
 */
export const del = async (organization: { id: string }): Promise<void> => {
  await deleter(tables.ORGANIZATIONS, organization.id)
}
