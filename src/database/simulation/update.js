import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update simulation
 * @memberof module:src/database/simulation
 * @param {Object} simulation Simulation { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  return updater(databases.SIMULATIONS, simulation.id, data)
}

export default update
