import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  simulation: { id: string },
  data: Array<DataBaseEntry>
): Promise<void> => {
  await updater(tables.SIMULATIONS, simulation.id, data)
}
