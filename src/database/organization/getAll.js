import query from '..'
import { databases } from '@/config/db'

/**
 * Get all organization
 * @memberof module:database/organization
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.ORGANIZATIONS
  )
  return response.rows
}

export default getAll
