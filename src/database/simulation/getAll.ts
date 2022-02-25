/** @module Database.Simulation.GetAll */

import { ISimulation } from '../index.d'

import { tables } from '@/config/db'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Simulations
 */
export const getAll = async (
  data: Array<string>
): Promise<Array<ISimulation>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SIMULATIONS,
    []
  )

  return response.rows
}
