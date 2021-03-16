import { getter } from '..'
import { databases } from '@/config/db'

/**
 * Get simulation by id
 * @memberof module:database/simulation
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.SIMULATIONS, id, data)

  const simulation = response.rows[0]
  simulation.id = id

  return simulation
}

export default get
