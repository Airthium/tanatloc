import { tables } from '@/config/db'

import query from '..'
import { Organization } from './get'

/**
 * Get all
 * @memberof Database.Organization
 * @param {Array<string>} data Data
 * @returns {Array} Organizations
 */
export const getAll = async (
  data: Array<string>
): Promise<Array<Organization>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.ORGANIZATIONS,
    []
  )

  return response.rows
}
