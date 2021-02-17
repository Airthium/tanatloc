import query from '..'
import { databases } from '@/config/db'

/**
 * Get system items
 * @memberof module:src/database/avatar
 * @param {Object} data Data [ key, ]
 */
const get = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.SYSTEM
  )

  return response.rows[0]
}

export default get
