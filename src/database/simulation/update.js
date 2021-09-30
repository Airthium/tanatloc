import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  await updater(tables.SIMULATIONS, simulation.id, data)
}

export default update
