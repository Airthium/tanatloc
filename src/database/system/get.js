import query from '..'
import { tables } from '@/config/db'

/**
 * Get system items
 * @memberof module:database/avatar
 * @param {Object} data Data [ key, ]
 */
const get = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM
  )

  return response.rows[0]
}

export default get
