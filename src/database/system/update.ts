/** @module Database.System.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update items
 * @param data Data
 */
export const update = async (data: Array<IDataBaseEntry>): Promise<void> => {
  await updater(tables.SYSTEM, '', data)
}
