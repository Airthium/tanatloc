/** @module Lib.Simulation */

import path from 'path'

import { IDataBaseEntry } from '@/database/index.d'
import { IModel, IModelTypedBoundaryCondition } from '@/models/index.d'
import { ISimulationGet } from '../index.d'

import { GEOMETRY, GEOMETRY_RELATIVE, SIMULATION } from '@/config/storage'

import SimulationDB, {
  INewSimulation,
  ISimulation,
  TSimulationGet
} from '@/database/simulation'

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
const get = async <T extends TSimulationGet>(
  id: string,
  data: T
): Promise<ISimulationGet<T>> => {
  const simulationData = (await SimulationDB.get(id, data)) as ISimulationGet<T>

  if (data.includes('tasks') && !simulationData.tasks) simulationData.tasks = []

  return simulationData
}

/**
 * Get all
 * @param data Data
 * @returns Simulations
 */
const getAll = async <T extends TSimulationGet>(
  data: T
): Promise<ISimulation<T>[]> => {
  const simulations = await SimulationDB.getAll(data)

  if (data.includes('tasks'))
    simulations.forEach((simulation) => {
      if (!simulation.tasks) simulation.tasks = []
    })

  return simulations
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
 * Copy geometry(ies)
 * @param simulation Simulation
 * @param configuration Configuration
 */
const copyGeometry = async (
  simulation: { id: string },
  configuration: IModel['configuration']
): Promise<void> => {
  const geometryId = configuration.geometry?.value
  const geometriesIds = configuration.geometry?.values
  if (geometryId) {
    const geometry = await Geometry.get(geometryId, [
      'name',
      'uploadfilename',
      'brep'
    ])
    configuration.geometry.data = {}
    configuration.geometry.data.file =
      configuration.dimension === 2 ? geometry.brep : geometry.uploadfilename
    configuration.geometry.data.name = geometry.name
    configuration.geometry.data.path = GEOMETRY_RELATIVE
    await Tools.copyFile(
      {
        path: GEOMETRY,
        file: configuration.geometry.data.file
      },
      {
        path: path.join(SIMULATION, simulation.id, 'geometry'),
        file: configuration.geometry.data.file
      }
    )
  } else if (geometriesIds) {
    configuration.geometry.datas = []
    for (const gId of geometriesIds) {
      const geometry = await Geometry.get(gId, [
        'name',
        'uploadfilename',
        'brep'
      ])
      const file =
        configuration.dimension === 2 ? geometry.brep : geometry.uploadfilename
      configuration.geometry.datas.push({
        file,
        name: geometry.name,
        path: GEOMETRY_RELATIVE
      })
      await Tools.copyFile(
        {
          path: GEOMETRY,
          file: file
        },
        {
          path: path.join(SIMULATION, simulation.id, 'geometry'),
          file: file
        }
      )
    }

    // Check materials
    configuration.materials?.values?.forEach((material) => {
      const index = geometriesIds.findIndex((id) => id === material.geometry)
      material.geometryIndex = index
    })

    // Check boundary conditions
    Object.keys(configuration.boundaryConditions).forEach((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return

      const typedBoundaryCondition = configuration.boundaryConditions[
        key
      ] as IModelTypedBoundaryCondition

      const values = typedBoundaryCondition.values
      values?.forEach((value) => {
        const index = geometriesIds.findIndex((id) => id === value.geometry)
        value.geometryIndex = index
      })
    })
  }
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
  const configuration = simulationData.scheme?.configuration
  if (!configuration) return

  // Update status
  configuration.run = {
    ...configuration.run,
    done: undefined,
    error: undefined
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
  const plugins = await Plugins.serverList()
  const plugin = plugins.find(
    (p) => p.key === configuration.run?.cloudServer?.key
  )

  // Check plugin
  if (!plugin) {
    const err = new Error('Unavailable plugin')
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

  // Check authorized
  const userData = await User.get(user.id, ['authorizedplugins'])
  if (!userData.authorizedplugins?.includes(plugin.key as string)) {
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
  await copyGeometry(simulation, configuration)

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

  // Prepare boundary conditions
  Object.keys(configuration.boundaryConditions).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done') return

    const boundaryCondition = configuration.boundaryConditions[
      key
    ] as IModelTypedBoundaryCondition
    boundaryCondition.values?.forEach((value) => {
      value.labels = value.selected
        .map((s) => s.label)
        .filter((s) => s)
        .join(', ')
    })
  })

  // Compute
  plugin.lib
    .computeSimulation(simulation, simulationData.scheme)
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
    .catch((err: any) => {
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
  const configuration = simulationData.scheme?.configuration
  if (!configuration) return

  const tasks = simulationData.tasks

  // Find plugin
  const pluginsLibs = await Plugins.serverList()
  const pluginLib = pluginsLibs.find(
    (p) => p.key === configuration.run.cloudServer?.key
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
    return await Tools.readFile(filePath)
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

/**
 * Copy
 * @param project Project
 * @param simulation Simulation
 */
const copy = async (
  project: { id: string },
  simulation: { id: string }
): Promise<void /*INewSimulation*/> => {
  // TODO
  // replace copy in client by this one
  console.log(project)
  console.log(simulation)
}

const Simulation = {
  add,
  get,
  getAll,
  update,
  del,
  run,
  stop,
  getLog,
  archive,
  copy
}
export default Simulation
