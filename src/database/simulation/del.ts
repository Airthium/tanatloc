import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation `{ id }`
 */
export const del = async (simulation: { id: string }) => {
  await deleter(tables.SIMULATIONS, simulation.id)
}
