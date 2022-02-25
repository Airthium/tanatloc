/** @module Database.User.Get */

import { IUser } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id User id (or key)
 * @param data Data
 * @param key Key (override id selector)
 * @returns User
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
