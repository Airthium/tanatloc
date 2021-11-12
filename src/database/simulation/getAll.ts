import { tables } from '@/config/db'

import query from '..'

/**
 * Get all
 * @memberof Database.Simulation
 * @param {Array} data Data
 * @returns {Array} Simulations
 */
export const getAll = async (data: Array<string>) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SIMULATIONS,
    []
  )

  return response.rows
}
