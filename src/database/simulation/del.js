import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete simulation
 * @memberof module:src/database/simulation
 * @param {Object} simulation Simulation { id }
 */
const del = async (simulation) => {
  await deleter(databases.SIMULATIONS, simulation.id)
}

export default del
