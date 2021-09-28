import query from '..'
import { tables } from '@/config/db'

/**
 * Get all simulations
 * @memberof module:database/simulation
 * @param {Array} data Data
 */
const getAll = async (data) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SIMULATIONS
  )
  return response.rows
}

export default getAll
