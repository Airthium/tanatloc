import query from '..'
import { tables } from '@/config/db'

/**
 * Get all
 * @memberof Database.Simulation
 * @param {Array} data Data
 * @returns {Array} Simulations
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SIMULATIONS
  )
  return response.rows
}

export default getAll
