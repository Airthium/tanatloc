/** @module Database.Organization.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param organization Organization
 * @param data Data
 */
export const update = async (
  organization: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await updater(tables.ORGANIZATIONS, organization.id, data)
}
