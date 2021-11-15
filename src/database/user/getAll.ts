import { tables } from '@/config/db'

import { query } from '..'
import { IUser } from '../index.d'

/**
 * Get all
 * @memberof Database.User
 * @param {Array} data Data
 * @returns {Array} Users
 */
export const getAll = async (data: Array<string>): Promise<Array<IUser>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS,
    []
  )

  return response.rows
}
