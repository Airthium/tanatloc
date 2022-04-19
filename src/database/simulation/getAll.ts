/** @module Database.Simulation.GetAll */

import { tables } from '@/config/db'

import { TSimulationGet, ISimulation } from './get'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Simulations
 */
export const getAll = async <T extends TSimulationGet>(
  data: T
): Promise<ISimulation<T>[]> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SIMULATIONS,
    []
  )

  return response.rows
}
