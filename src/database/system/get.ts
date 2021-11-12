import { tables } from '@/config/db'

import query from '..'

type System = {
  allowsignup?: boolean
  password?: object
}

/**
 * Get items
 * @memberof Database.System
 * @param {Object} data Data
 * @returns {Object} System `{ ...data }`
 */
export const get = async (data: Array<string>): Promise<System> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM,
    []
  )

  return response.rows[0]
}
