import query from '..'
import { tables } from '@/config/db'

/**
 * Get all
 * @memberof Database.Organization
 * @param {Array} data Data
 * @returns {Array} Organizations
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.ORGANIZATIONS
  )

  return response.rows
}

export default getAll
