import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Simulation
 * @param simulation Simulation
 */
export const del = async (simulation: { id: string }) => {
  await deleter(tables.SIMULATIONS, simulation.id)
}
