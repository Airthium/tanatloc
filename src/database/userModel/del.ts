/** @module Database.UserModel.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 *
 * @param model Delete
 * @param userModel User model
 */
export const del = async (userModel: { id: string }): Promise<void> => {
  await deleter(tables.MODELS, userModel.id)
}
