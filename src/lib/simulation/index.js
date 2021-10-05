/** @namespace Lib.Simulation */

import path from 'path'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import User from '../user'
import Project from '../project'
import Geometry from '../geometry'
import Tools from '../tools'
import Plugins from '../plugins'

/**
 * Add
 * @memberof Lib.Simulation
 * @param {Object} project Project `{ id }`
 * @param {Object} simulation Simulation `{ name, scheme }`
 * @returns {Object} Simulation `{ id, name, scheme, project }`
 */
const add = async (project, simulation) => {
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
 * Get
 * @memberof Lib.Simulation
 * @param {string} id Simulation's id
 * @param {Array} data Data
 * @returns {Object} Simulation `{ id, ...data }`
 */
const get = async (id, data) => {
  return SimulationDB.get(id, data)
}

/**
 * Get all
 * @memberof Lib.Simulation
 * @param {Array} data Data
 * @returns {Array} Simulations
 */
const getAll = async (data) => {
  return SimulationDB.getAll(data)
}

/**
 * Update
 * @memberof Lib.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
const update = async (simulation, data) => {
  // Update
  await SimulationDB.update(simulation, data)
}

/**
 * Delete
 * @memberof Lib.Simulation
 * @param {Object} simulation Simulation `{ id }`
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
 * Run
 * @memberof Lib.Simulation
 * @param {Object} user User `{ id }`
 * @param {Object} simulation Simulation `{ id }`
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
  const plugins = await Plugins.serverList()
  const plugin = plugins.find(
    (p) => p.key === configuration.run.cloudServer.key
  )

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

  // Check coupling
  if (configuration.initialization && configuration.initialization.value) {
    const type = configuration.initialization.value.type

    if (type === 'coupling') {
      // Get previous mesh and result
      const couplingSimulation = configuration.initialization.value.simulation
      const couplingResult = configuration.initialization.value.result

      if (!couplingSimulation || !couplingResult) {
        configuration.initialization.value = undefined
      } else {
        const couplingPath = path.join(
          storage.SIMULATION,
          couplingSimulation,
          'run',
          'coupling'
        )

        await Tools.copyFile(
          {
            path: couplingPath,
            file: couplingResult + '.dat'
          },
          {
            path: path.join(
              storage.SIMULATION,
              simulation.id,
              'run',
              'coupling'
            ),
            file: 'initialization.dat'
          }
        )
        await Tools.copyFile(
          {
            path: couplingPath,
            file: couplingResult + '.mesh'
          },
          {
            path: path.join(
              storage.SIMULATION,
              simulation.id,
              'run',
              'coupling'
            ),
            file: 'initialization.mesh'
          }
        )

        configuration.initialization.value = {
          type: 'coupling',
          dat: path.join('run', 'coupling', 'initialization.dat'),
          mesh: path.join('run', 'coupling', 'initialization.mesh')
        }
      }
    }
  }

  // Compute
  plugin.lib
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
 * Stop
 * @memberof Lib.Simulation
 * @param {Object} simulation Simulation `{ id }`
 */
const stop = async ({ id }) => {
  const simulation = await get(id, ['scheme', 'tasks'])

  // Global
  const configuration = simulation.scheme.configuration
  const tasks = simulation.tasks

  // Find plugin
  const pluginsLibs = await Plugins.serverList()
  const pluginLib = pluginsLibs.find(
    (p) => p.key === configuration.run.cloudServer.key
  )?.lib

  // Stop
  await pluginLib.stop(id, tasks, configuration)

  // Update tasks
  tasks?.forEach((task) => {
    if (!task) return
    if (task.status === 'wait' || task.status === 'process')
      task.status = 'error'
    task.error += 'Job killed'
  })
  await update({ id }, [
    {
      key: 'tasks',
      value: tasks
    }
  ])
}

/**
 * Get log
 * @memberof Lib.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {string} file File
 * @returns {string} Log
 */
const getLog = async ({ id }, file) => {
  // Path
  const filePath = path.join(storage.SIMULATION, id, file)

  // Write file
  return Tools.readFile(filePath)
}

const Simulation = { add, get, getAll, update, del, run, stop, getLog }
export default Simulation
