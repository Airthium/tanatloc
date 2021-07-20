/** @module lib/simulation */

import path from 'path'

import storage from '@/config/storage'

import PluginAPIs from '@/plugins/api'

import SimulationDB from '@/database/simulation'

import User from '../user'
import Project from '../project'
import Geometry from '../geometry'
import Tools from '../tools'

/**
 * Add simulation
 * @param {Object} Param { project: { id }, simulation: { name, scheme } }
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
  return SimulationDB.get(id, data)
}

/**
 * Update simulation
 * @param {Object} simulation Simulation { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  // Update
  await SimulationDB.update(simulation, data)
}

/**
 * Delete simulation
 * @param {Object} simulation Simulation { id }
 */
const del = async (simulation) => {
  // Data
  const simulationData = await get(simulation.id, ['project'])

  // Delete simulation reference in project
  await Project.update({ id: simulationData.project }, [
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

  // Delete simulation
  await SimulationDB.del(simulation)
}

/**
 * Run simulation
 * @param {Object} user User { id }
 * @param {Object} simulation Simulation { id }
 */
const run = async (user, { id }) => {
  const simulation = await get(id, ['scheme'])

  // Global
  const configuration = simulation.scheme.configuration
  const algorithm = simulation.scheme.algorithm

  // Update status
  configuration.run = {
    ...configuration.run,
    done: null,
    error: null
  }
  await update({ id }, [
    {
      key: 'scheme',
      type: 'json',
      method: 'set',
      path: ['configuration', 'run'],
      value: {
        ...configuration.run,
        done: null,
        error: null
      }
    }
  ])

  // Find plugin
  const plugin = PluginAPIs[configuration.run.cloudServer.key]

  // Check authorized
  const userData = await User.get(user.id, ['authorizedplugins'])
  if (!userData.authorizedplugins?.includes(plugin.key)) {
    const err = { message: 'Unauthorized' }
    console.error(err)

    configuration.run = {
      ...configuration.run,
      error: err
    }
    update({ id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: {
          ...configuration.run,
          error: err
        }
      }
    ])

    return
  }

  // Copy geometry
  const geometryId = configuration.geometry.value
  const geometry = await Geometry.get(geometryId, [
    'uploadfilename',
    'extension'
  ])
  configuration.geometry.file = geometry.uploadfilename
  configuration.geometry.name = geometry.uploadfilename.replace(
    '.' + geometry.extension,
    ''
  )
  configuration.geometry.path = 'geometry'
  await Tools.copyFile(
    {
      path: storage.GEOMETRY,
      file: geometry.uploadfilename
    },
    {
      path: path.join(storage.SIMULATION, simulation.id, 'geometry'),
      file: geometry.uploadfilename
    }
  )

  // TODO
  // // Check coupling
  // if (configuration.initialization && configuration.initialization.value) {
  //   const type = configuration.initialization.value.type

  //   if (configuration.initialization[type].type === 'SIMULATION_COUPLING') {
  //     // Get previous mesh and result

  //     console.log(configuration.initialization.value.simulation)
  //     console.log(configuration.initialization.value.result)
  //   }
  // }

  // // TODO remove this
  // update({ id }, [
  //   {
  //     key: 'scheme',
  //     type: 'json',
  //     method: 'set',
  //     path: ['configuration', 'run'],
  //     value: {
  //       ...configuration.run,
  //       done: true
  //     }
  //   }
  // ])

  // Compute
  plugin
    .computeSimulation({ id }, algorithm, configuration)
    .then(() => {
      configuration.run = {
        ...configuration.run,
        done: true
      }
      update({ id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'run'],
          value: {
            ...configuration.run,
            done: true
          }
        }
      ])
    })
    .catch((err) => {
      console.error(err)

      configuration.run = {
        ...configuration.run,
        error: err
      }
      update({ id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'run'],
          value: {
            ...configuration.run,
            error: err
          }
        }
      ])
    })
}

/**
 * Stop simulation
 * @param {Object} simulation Simulation { id }
 */
const stop = async ({ id }) => {
  const simulation = await get(id, ['scheme', 'tasks'])

  // Global
  const configuration = simulation.scheme.configuration
  const tasks = simulation.tasks

  // Find plugin
  const plugin = PluginAPIs[configuration.run.cloudServer.key]

  // Stop
  await plugin.stop(tasks, configuration)

  // Update tasks
  tasks?.forEach((task) => {
    if (task.status === 'wait') task.status = 'error'
    task.error += 'Job killed'
  })
  await update({ id }, [
    {
      key: 'tasks',
      value: tasks
    }
  ])
}

const getLog = async ({ id }, file) => {
  // Path
  const filePath = path.join(storage.SIMULATION, id, file)

  // Write file
  return Tools.readFile(filePath)
}

const Simulation = { add, get, update, del, run, stop, getLog }
export default Simulation
