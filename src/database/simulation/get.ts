import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Simulation
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Simulation `{ id, ...data }`
 */
const get = async (id, data) => {
  const response = await getter(tables.SIMULATIONS, id, data)

  const simulation = response.rows[0]
  simulation && (simulation.id = id)

  return simulation
}

export default get
