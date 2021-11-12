import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation `{ id }`
 */
const del = async (simulation) => {
  await deleter(tables.SIMULATIONS, simulation.id)
}

export default del
