/** @module Lib.Simulation */

import path from 'path'

import { IDataBaseEntry, INewSimulation, ISimulation } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { GEOMETRY, SIMULATION } from '@/config/storage'

import SimulationDB from '@/database/simulation'

import User from '../user'
import Project from '../project'
import Geometry from '../geometry'
import Tools from '../tools'
import Plugins from '../plugins'

/**
 * Add
 * @param project Project
 * @param simulation Simulation
 * @returns Simulation
 */
const add = async (
  project: { id: string },
  simulation: { name: string; scheme: IModel }
): Promise<INewSimulation> => {
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
 * @param id Simulation id
 * @param data Data
 * @returns Simulation
 */
const get = async (id: string, data: string[]): Promise<ISimulation> => {
  const simulationData = await SimulationDB.get(id, data)

  if (data.includes('tasks') && !simulationData.tasks) simulationData.tasks = []

  return simulationData
}

/**
 * Get all
 * @param data Data
 * @returns Simulations
 */
const getAll = async (data: string[]): Promise<ISimulation[]> => {
  return SimulationDB.getAll(data)
}

/**
 * Update
 * @param simulation Simulation
 * @param data Data
 */
const update = async (
  simulation: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Update
  await SimulationDB.update(simulation, data)
}

/**
 * Delete
 * @param simulation Simulation
 */
const del = async (simulation: { id: string }): Promise<void> => {
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
  const simulationDirectory = path.join(SIMULATION, simulation.id)
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
 * @param user User
 * @param simulation Simulation
 */
const run = async (
  user: { id: string },
  simulation: { id: string }
): Promise<void> => {
  const simulationData = await get(simulation.id, ['scheme'])

  // Global
  const configuration = simulationData.scheme.configuration
  const algorithm = simulationData.scheme.algorithm

  // Update status
  configuration.run = {
    ...configuration.run,
    done: null,
    error: null
  }
  await update(simulation, [
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
  const plugins = Plugins.serverList()
  const plugin = plugins.find(
    (p) => p.key === configuration.run.cloudServer.key
  )

  // Check authorized
  const userData = await User.get(user.id, ['authorizedplugins'])
  if (!userData.authorizedplugins?.includes(plugin.key)) {
    const err = new Error('Unauthorized')
    console.error(err)

    configuration.run = {
      ...configuration.run,
      error: err
    }
    update(simulation, [
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

  // Create run path
  await Tools.createPath(path.join(SIMULATION, simulation.id, 'run'))

  // Copy geometry
  const geometryId = configuration.geometry.value
  const geometry = await Geometry.get(geometryId, [
    'uploadfilename',
    'extension'
  ])
  if (geometry.extension === 'dxf') {
    // 2D replace
    geometry.uploadfilename = geometry.uploadfilename.replace('.dxf', '.brep')
  }
  configuration.geometry.file = geometry.uploadfilename
  configuration.geometry.name = geometry.uploadfilename.replace(
    '.' + geometry.extension,
    ''
  )
  configuration.geometry.path = 'geometry'
  await Tools.copyFile(
    {
      path: GEOMETRY,
      file: geometry.uploadfilename
    },
    {
      path: path.join(SIMULATION, simulation.id, 'geometry'),
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
          SIMULATION,
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
            path: path.join(SIMULATION, simulation.id, 'run', 'coupling'),
            file: 'initialization.dat'
          }
        )
        await Tools.copyFile(
          {
            path: couplingPath,
            file: couplingResult + '.mesh'
          },
          {
            path: path.join(SIMULATION, simulation.id, 'run', 'coupling'),
            file: 'initialization.mesh'
          }
        )

        configuration.initialization.value = {
          type: 'coupling',
          number: configuration.initialization.value.number,
          dat: path.join('run', 'coupling', 'initialization.dat'),
          mesh: path.join('run', 'coupling', 'initialization.mesh')
        }
      }
    }
  }

  // Compute
  plugin.lib
    .computeSimulation(simulation, algorithm, configuration)
    .then(() => {
      configuration.run = {
        ...configuration.run,
        done: true
      }
      update(simulation, [
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
      update(simulation, [
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
 * @param simulation Simulation
 */
const stop = async (simulation: { id: string }): Promise<void> => {
  const simulationData = await get(simulation.id, ['scheme', 'tasks'])

  // Global
  const configuration = simulationData.scheme.configuration
  const tasks = simulationData.tasks

  // Find plugin
  const pluginsLibs = Plugins.serverList()
  const pluginLib = pluginsLibs.find(
    (p) => p.key === configuration.run.cloudServer.key
  )?.lib

  // Stop
  await pluginLib.stop(simulation.id, tasks, configuration)

  // Update tasks
  tasks?.forEach((task) => {
    if (!task) return
    if (task.status === 'wait' || task.status === 'process')
      task.status = 'error'
    task.error += 'Job killed'
  })
  await update(simulation, [
    {
      key: 'tasks',
      value: tasks
    }
  ])
}

/**
 * Get log
 * @param simulation Simulation
 * @param file File
 * @returns Log
 */
const getLog = async (
  simulation: { id: string },
  file: string
): Promise<Buffer> => {
  // Path
  const filePath = path.join(SIMULATION, simulation.id, file)

  // Read file
  try {
    return await (Tools.readFile(filePath) as Promise<Buffer>)
  } catch (err) {
    return Buffer.from('Not available yet')
  }
}

/**
 * Archive
 * @param simulation Simulation
 * @param to Target
 */
const archive = async (
  simulation: { id: string },
  to: string
): Promise<void> => {
  await Tools.copyDirectory(
    path.join(SIMULATION, simulation.id),
    path.join(to, simulation.id)
  )
  await Tools.removeDirectory(path.join(SIMULATION, simulation.id))
}

const Simulation = { add, get, getAll, update, del, run, stop, getLog, archive }
export default Simulation
