import { tables } from '@/config/db'

import { query } from '..'
import { ISystem } from '../index.d'

/**
 * Get items
 * @memberof Database.System
 * @param data Data
 * @returns System
 */
export const get = async (data: Array<string>): Promise<ISystem> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM,
    []
  )

  return response.rows[0]
}
