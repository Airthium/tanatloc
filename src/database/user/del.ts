import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.User
 * @param user User
 */
export const del = async (user: { id: string }): Promise<void> => {
  await deleter(tables.USERS, user.id)
}
