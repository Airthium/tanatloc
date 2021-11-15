import { tables } from '@/config/db'

import { getter } from '..'
import { IUser } from '../index.d'

/**
 * Get
 * @memberof Database.User
 * @param {string} id User's id (or key)
 * @param {Array} data Data
 * @param {string} [key=id] Key (override id selector)
 * @returns {Object} User `{ [key], ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>,
  key: string = 'id'
): Promise<IUser> => {
  const response = await getter(tables.USERS, id, data, key)

  const user = response.rows[0]
  user && (user[key] = id)

  return user
}
