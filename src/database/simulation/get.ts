import { tables } from '@/config/db'

import { getter } from '..'

type Simulation = {
  id: string
  name?: string
  scheme?: object
  project?: string
}

/**
 * Get
 * @memberof Database.Simulation
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Simulation `{ id, ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<Simulation> => {
  const response = await getter(tables.SIMULATIONS, id, data)

  const simulation = response.rows[0]
  simulation && (simulation.id = id)

  return simulation
}
