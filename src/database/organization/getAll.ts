import { tables } from '@/config/db'

import { query } from '..'
import { IOrganization } from '../index.d'

/**
 * Get all
 * @memberof Database.Organization
 * @param data Data
 * @returns Organizations
 */
export const getAll = async (data: Array<string>): Promise<IOrganization[]> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.ORGANIZATIONS,
    []
  )

  return response.rows
}
