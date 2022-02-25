/** @module Database.Simulation.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param simulation Simulation
 */
export const del = async (simulation: { id: string }) => {
  await deleter(tables.SIMULATIONS, simulation.id)
}
