import query from '..'
import { databases } from '@/config/db'

/**
 * Get all groups
 * @memberof module:database/group
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.GROUPS
  )
  return response.rows
}

export default getAll
