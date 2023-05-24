/** @module Database.Simulation.Add */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param simulation Simulation
 * @param data Data
 */
export const update = async (
  simulation: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await updater(tables.SIMULATIONS, simulation.id, data)
}
