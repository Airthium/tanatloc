import { tables } from '@/config/db'

import { query } from '..'
import { IGroup } from '../index.d'

/**
 * Get all
 * @memberof Database.Group
 * @param data Data
 * @returns Groups
 */
export const getAll = async (data: Array<string>): Promise<Array<IGroup>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.GROUPS,
    []
  )

  return response.rows
}
