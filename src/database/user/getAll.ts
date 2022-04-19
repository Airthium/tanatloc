/** @module Database.User.GetAll */

import { tables } from '@/config/db'

import { TUserGet, IUser } from './get'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Users
 */
export const getAll = async <T extends TUserGet>(
  data: T
): Promise<IUser<T>[]> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS,
    []
  )

  return response.rows
}
