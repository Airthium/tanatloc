/** @module Database.User.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param user User
 * @param data Data
 */
export const update = async (
  user: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await updater(tables.USERS, user.id, data)
}
