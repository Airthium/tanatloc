/** @module src/lib/simulation */

import path from 'path'

import storage from '../../config/storage'

import {
  add as dBadd,
  get as dBget,
  update as dBupdate,
  del as dBdel
} from '../database/simulation'

import { update as updateProject } from './project'
import { writeFile, convert } from './tools'

/**
 * Add simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { name, scheme }
 */
const add = async ({ project, simulation }) => {
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

  // Return
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
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  // Check for file
  // TODO remove at override ? (for example geometry)
  await Promise.all(
    data.map(async (d) => {
      if (d.value.file) {
        //Write file
        const location = path.join(storage.SIMULATION, simulation.id, d.path[1])
        const file = d.value.file
        const fileName = await writeFile(
          location,
          file.name,
          Buffer.from(file.buffer).toString()
        )

        // Update object
        d.value.file.originPath = d.path[1]
        d.value.file.origin = fileName

        // Convert file
        const part = await convert(location, file)
        d.value.file.partPath = path.join(d.path[1], part.path)
        d.value.file.part = part.part

        // remove unused
        delete d.value.file.uid
        delete d.value.file.buffer
      }
      return
    })
  )

  // Update
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
