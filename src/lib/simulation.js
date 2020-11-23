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
import { writeFile, convert, removeFile, removeDirectory } from './tools'

/**
 * Add simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { name, scheme }
 */
const add = async ({ project, simulation }) => {
  // Add simulation
  const simulationData = await dBadd({
    ...simulation,
    project: project.id
  })

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
 * Check files in update
 * @param {Object} simulation Simulation { id }
 * @param {Array} data Data
 */
const checkFiles = async (simulation, data) => {
  await Promise.all(
    data.map(async (d) => {
      // No scheme
      if (d.key !== 'scheme') return
      // No file
      if (!d.value.file) return

      // Current data in dB
      const prevData = await get(simulation.id, ['scheme'])

      // Sub object from d.path
      const subObj = d.path.reduce((obj, key) => obj[key], prevData.scheme)

      // Remove old file
      if (subObj.file) {
        if (subObj.file.origin) {
          const originFile = path.join(
            storage.SIMULATION,
            simulation.id,
            subObj.file.originPath,
            subObj.file.origin
          )
          try {
            await removeFile(originFile)
          } catch (err) {
            console.warn(err)
          }
        }
        if (subObj.file.part) {
          const partDirectory = path.join(
            storage.SIMULATION,
            simulation.id,
            subObj.file.partPath
          )
          try {
            await removeDirectory(partDirectory)
          } catch (err) {
            console.warn(err)
          }
        }
      }

      if (d.value.file === 'remove') {
        d.value.file = undefined
      } else {
        // Write new file
        const subDir = d.path.slice(-1).pop()
        const location = path.join(storage.SIMULATION, simulation.id, subDir)
        const file = d.value.file
        await writeFile(
          location,
          file.name,
          Buffer.from(file.buffer).toString()
        )

        // Update object
        d.value.file.originPath = subDir
        d.value.file.origin = file.name

        // Convert file
        const part = await convert(location, file)
        d.value.file.partPath = path.join(subDir, part.path)
        d.value.file.part = part.part

        // Remove unused
        delete d.value.file.uid
        delete d.value.file.buffer
      }

      return
    })
  )
}

/**
 * Update simulation
 * @param {Object} simulation Simulation { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  // Check for files
  await checkFiles(simulation, data)

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

  // Delete folder
  const simulationDirectory = path.join(storage.SIMULATION, simulation.id)
  try {
    await removeDirectory(simulationDirectory)
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Run simulation
 * @param {Object} simulation Simulation { id }
 */
const run = async ({ id }) => {
  const simulation = await get(id, ['scheme'])
  console.log(simulation)
}

export { add, get, update, del, run }
