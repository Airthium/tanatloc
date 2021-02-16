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

  const items = response.rows[0]

  return items
}

export default get
