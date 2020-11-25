/** @module src/lib/simulation */

import path from 'path'

import storage from '../../config/storage'

import SimulationDB from '../database/simulation'

import Project from './project'
import Tools from './tools'
import Compute from './compute'

/**
 * Add simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { name, scheme }
 */
const add = async ({ project, simulation }) => {
  // Add simulation
  const simulationData = await SimulationDB.add({
    ...simulation,
    project: project.id
  })

  // Add simulation reference in project
  await Project.update(project, [
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
  const simulation = SimulationDB.get(id, data)

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
        if (subObj.file.fileName) {
          const originFile = path.join(
            storage.SIMULATION,
            simulation.id,
            subObj.file.originPath,
            subObj.file.fileName
          )
          try {
            await Tools.removeFile(originFile)
          } catch (err) {
            console.warn(err)
          }
        }
        if (subObj.file.partPath) {
          const partDirectory = path.join(
            storage.SIMULATION,
            simulation.id,
            subObj.file.partPath
          )
          try {
            await Tools.removeDirectory(partDirectory)
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

        file.originPath = subDir
        file.extension = file.name.split('.').pop()
        file.fileName = file.uid + '.' + file.extension
        await Tools.writeFile(
          location,
          file.fileName,
          Buffer.from(file.buffer).toString()
        )

        // Convert file
        const part = await Tools.convert(location, file)
        d.value.file.partPath = path.join(subDir, part.path)
        d.value.file.part = part.part

        // Remove unused
        delete file.buffer
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
  await SimulationDB.update(simulation, data)
}

/**
 * Delete simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { id }
 */
const del = async ({ id }, simulation) => {
  // Delete simulation
  await SimulationDB.del(simulation)

  // Delete simulation reference in project
  await Project.update({ id }, [
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
    await Tools.removeDirectory(simulationDirectory)
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

  // Global
  const simulationPath = path.join(storage.SIMULATION, id)
  const configuration = simulation.scheme.configuration

  Compute.computeSimulation(id, simulationPath, configuration)
}

export default { add, get, update, del, run }
