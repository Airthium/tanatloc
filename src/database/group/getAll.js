import query from '..'
import { tables } from '@/config/db'

/**
 * Get all
 * @memberof Database.Group
 * @param {Array} data Data
 * @returns {Array} Groups
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.GROUPS
  )

  return response.rows
}

export default getAll
