import query from '..'
import { tables } from '@/config/db'

/**
 * Get all
 * @memberof Database.User
 * @param {Array} data Data
 * @returns {Array} Users
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS
  )

  return response.rows
}

export default getAll
