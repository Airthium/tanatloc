/** @module Database.Simulation.Add */

import { IModel } from '@/models/index.d'

import { tables } from '@/config/db'

import { query } from '..'

export interface INewSimulation {
  id: string
  name: string
  scheme: IModel
  project: string
}

/**
 * Add
 * @param simulation Simulation
 * @returns New simulation
 */
export const add = async (simulation: {
  name: string
  scheme: object
  project: string
}): Promise<INewSimulation> => {
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
