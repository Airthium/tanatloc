/** @module src/lib/simulation */

import {
  add as dBadd,
  get as dBget,
  update as dBupdate,
  del as dBdel
} from '../database/simulation'

import { update as updateProject } from './project'

/**
 * Add simulation
 * @param {Object} project Project { id }
 * @param {Object} simualtion Simulation { name, scheme }
 */
const add = async (project, simulation) => {
  // Add simulation
  const simulationData = await dBadd(simulation)

  // Add simulation reference in project
  await updateProject(project, [
    {
      type: 'array',
      method: 'append',
      key: 'simulations',
      value: simulationData.id
    }
  ])

  return simulationData
}

/**
 * Get simulation
 * @param {string} id Simulation's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const simulation = dBget(id, data)
  return simulation
}

/**
 * Update simulation
 * @param {Object} simulation Simulation { id }
 * @param {Object} data Data { data: [{...}] }
 */
const update = async (simulation, { data }) => {
  await dBupdate(simulation, data)
}

/**
 * Delete simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { id }
 */
const del = async ({ id }, simulation) => {
  // Delete simulation
  await dBdel(simulation)

  // Delete simulation reference in project
  await updateProject({ id }, [
    {
      type: 'array',
      method: 'remove',
      key: 'simulations',
      value: simulation.id
    }
  ])
}

export { add, get, update, del }
