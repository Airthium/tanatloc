import { tables } from '@/config/db'

import query from '..'

type NewSimulation = {
  id: string
  name: string
  scheme: object
  project: string
}

/**
 * Add
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation `{ name, scheme, project }`
 * @returns {Object} Simulation `{ id, name, scheme, project }`
 */
export const add = async (simulation: {
  name: string
  scheme: object
  project: string
}): Promise<NewSimulation> => {
  const response = await query(
    'INSERT INTO ' +
      tables.SIMULATIONS +
      ' (name, scheme, project) VALUES ($1, $2, $3) RETURNING id',
    [simulation.name, simulation.scheme, simulation.project]
  )

  const newSimulation = response.rows[0]
  newSimulation && (newSimulation.name = simulation.name)
  newSimulation && (newSimulation.scheme = simulation.scheme)
  newSimulation && (newSimulation.project = simulation.project)

  return newSimulation
}
