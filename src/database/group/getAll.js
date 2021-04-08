import query from '..'
import { tables } from '@/config/db'

/**
 * Get all groups
 * @memberof module:database/group
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.GROUPS
  )
  return response.rows
}

export default getAll
