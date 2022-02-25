/** @module Database.Simulation.Get */

import { ISimulation } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Simulation
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<ISimulation> => {
  const response = await getter(tables.SIMULATIONS, id, data)

  const simulation = response.rows[0]
  simulation && (simulation.id = id)

  return simulation
}
