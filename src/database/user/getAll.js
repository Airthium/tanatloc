import query from '..'
import { tables } from '@/config/db'

/**
 * Get all user
 * @memberof module:database/user
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS
  )
  return response.rows
}

export default getAll
