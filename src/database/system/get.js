import query from '..'
import { tables } from '@/config/db'

/**
 * Get items
 * @memberof Database.System
 * @param {Object} data Data
 * @returns {Object} System { ...data }
 */
const get = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM
  )

  return response.rows[0]
}

export default get
