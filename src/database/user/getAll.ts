import { tables } from '@/config/db'

import query from '..'
import { User } from './get'

/**
 * Get all
 * @memberof Database.User
 * @param {Array} data Data
 * @returns {Array} Users
 */
export const getAll = async (data: Array<string>): Promise<Array<User>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS,
    []
  )

  return response.rows
}
