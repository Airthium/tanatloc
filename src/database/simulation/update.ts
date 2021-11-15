import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  simulation: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.SIMULATIONS, simulation.id, data)
}
