/** @module Database.UserModel.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param UserModel User model
 * @param data Data
 */
export const update = async (
  UserModel: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await updater(tables.MODELS, UserModel.id, data)
}
