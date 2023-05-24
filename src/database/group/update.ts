/** @module Database.Group.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param group Group
 * @param data Data
 */
export const update = async (group: { id: string }, data: IDataBaseEntry[]) => {
  await updater(tables.GROUPS, group.id, data)
}
