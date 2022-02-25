/** @module Database.User.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param user User
 */
export const del = async (user: { id: string }): Promise<void> => {
  await deleter(tables.USERS, user.id)
}
