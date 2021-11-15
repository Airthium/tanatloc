import { tables } from '@/config/db'

import { query } from '..'
import { IOrganization } from '../index.d'

/**
 * Get all
 * @memberof Database.Organization
 * @param {Array<string>} data Data
 * @returns {Array} Organizations
 */
export const getAll = async (
  data: Array<string>
): Promise<Array<IOrganization>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.ORGANIZATIONS,
    []
  )

  return response.rows
}
