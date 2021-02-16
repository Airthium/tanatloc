import query from '..'
import { databases } from '@/config/db'

/**
 * Get all user
 * @memberof module:src/database/user
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.USERS
  )
  return response.rows
}

export default getAll
