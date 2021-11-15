import { tables } from '@/config/db'

import { query } from '..'
import { ISystem } from '../index.d'

/**
 * Get items
 * @memberof Database.System
 * @param {Object} data Data
 * @returns {Object} System `{ ...data }`
 */
export const get = async (data: Array<string>): Promise<ISystem> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM,
    []
  )

  return response.rows[0]
}