/** @module Lib.Simulation */

import path from 'path'

import { IDataBaseEntry } from '@/database/index.d'
import {
  IModel,
  IModelBoundaryConditions,
  IModelParameter,
  IModelParameters,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import { ISimulationGet } from '../index.d'
import { HPCServerPlugin } from '@/plugins/index.d'

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
): Promise<ISimulationGet<T> | undefined> => {
  const simulationData = await SimulationDB.get(id, data)
  if (!simulationData) return

  if (data.includes('tasks') && !simulationData.tasks) simulationData.tasks = []

  return simulationData as ISimulationGet<T>
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
  simulationData &&
    (await Project.update({ id: simulationData.project }, [
      {
        type: 'array',
        method: 'remove',
        key: 'simulations',
        value: simulation.id
      }
    ]))

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
 * Return error
 * @param simulation Simulation
 * @param configuration Configuration
 * @param message Message
 */
const returnError = async (
  simulation: { id: string },
  configuration: IModel['configuration'],
  message: string
): Promise<void> => {
  const err = new Error(message)
  console.error(err)

  configuration.run = {
    ...configuration.run,
    error: err
  }
  await update(simulation, [
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
}

/**
 * Foreach function for boundary conditions
 * @param boundaryConditions Boundary conditions
 * @param callback Callback
 */
const forEachBoundaryConditions = (
  boundaryConditions: IModelBoundaryConditions,
  callback: (boundaryCondition: IModelTypedBoundaryCondition) => void
): void => {
  Object.keys(boundaryConditions).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done') return
    const typedBoundaryCondition = boundaryConditions[
      key
    ] as IModelTypedBoundaryCondition
    callback(typedBoundaryCondition)
  })
}

/**
 * Foreach function for parameters
 * @param parameters Parameters
 * @param callback Callback
 */
const forEachParameters = (
  parameters: IModelParameters,
  callback: (parameter: {
    label: string
    advanced?: boolean
    children: IModelParameter[]
  }) => void
): void => {
  Object.keys(parameters).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done') return

    const parameter = parameters[key] as {
      label: string
      advanced?: boolean
      children: IModelParameter[]
    }
    callback(parameter)
  })
}

/**
 * Copy geometries
 * @param simulation Simulation
 * @param configuration Configuration
 */
const copyGeometries = async (
  simulation: { id: string },
  configuration: IModel['configuration']
): Promise<void> => {
  const children = configuration.geometry.children

  for (const child of children) {
    const id = child.value
    if (!id) continue

    // Get data
    const geometry = await Geometry.get(id, ['name', 'uploadfilename', 'brep'])
    if (!geometry) throw new Error('Geometry not found')
    child.data = {}
    child.data.file =
      configuration.dimension === 2 ? geometry.brep : geometry.uploadfilename
    child.data.name = geometry.name
    child.data.path = GEOMETRY_RELATIVE

    // Copy
    await Tools.copyFile(
      {
        path: GEOMETRY,
        file: child.data.file
      },
      {
        path: path.join(SIMULATION, simulation.id, 'geometry'),
        file: child.data.file
      }
    )
  }
}

/**
 * To float (FreeFEM)
 * @param num Number
 * @returns Float
 */
const toFloat = (num: number): string => {
  const numString = num.toString()
  if (numString.includes('.')) return numString
  else return numString + '.'
}

/**
 * Check mesh units
 * @param configuration Configuration
 */
const checkMeshUnits = (configuration: IModel['configuration']): void => {
  const children = configuration.geometry.children
  children.forEach((child) => {
    const meshParameters = child.meshParameters
    if (meshParameters?.type === 'manual') {
      const unit = meshParameters.unit
      if (unit?.multiplicator)
        meshParameters.value =
          '(' + meshParameters.value + ') / ' + toFloat(unit.multiplicator)
      if (unit?.adder)
        meshParameters.value = '(' + meshParameters.value + ') - ' + unit.adder
    }
  })
}

/**
 * Check materials units
 * @param configuration Configuration
 */
const checkMaterialsUnits = (configuration: IModel['configuration']): void => {
  const materials = configuration.materials
  materials?.values?.forEach((value) => {
    value.material.children.forEach((child) => {
      const unit = child.unit
      if (unit?.multiplicator)
        child.value = '(' + child.value + ') / ' + toFloat(unit.multiplicator)
      if (unit?.adder) child.value = '(' + child.value + ') - ' + unit.adder
    })
  })
}

/**
 * Check parameters units
 * @param configuration Configuration
 */
const checkParametersUnits = (configuration: IModel['configuration']): void => {
  const parameters = configuration.parameters
  forEachParameters(parameters, (parameter) => {
    parameter.children.forEach((child) => {
      const unit = child.unit
      if (child.value !== undefined) {
        if (unit?.multiplicator)
          child.value = '(' + child.value + ') / ' + toFloat(unit.multiplicator)
        if (unit?.adder) child.value = '(' + child.value + ') - ' + unit.adder
      }
    })
  })
}

/**
 * Check initialization units
 * @param configuration Configuration
 */
const checkInitializationUnits = (
  configuration: IModel['configuration']
): void => {
  const initialization = configuration.initialization
  const direct = initialization?.direct
  if (direct) {
    direct.children.forEach((child) => {
      const unit = child.unit
      if (child.value !== undefined) {
        if (unit?.multiplicator)
          child.value = '(' + child.value + ') / ' + toFloat(unit.multiplicator)
        if (unit?.adder) child.value = '(' + child.value + ') - ' + unit.adder
      }
    })
  }
}

/**
 * Check boundary conditions units
 * @param configuration Configuration
 */
const checkBoundaryConditionsUnits = (
  configuration: IModel['configuration']
): void => {
  const boundaryConditions = configuration.boundaryConditions
  forEachBoundaryConditions(boundaryConditions, (boundaryCondition) => {
    boundaryCondition.values?.forEach((v) => {
      v.values?.forEach((val) => {
        const unit = val.unit
        if (val.value !== undefined) {
          if (unit?.multiplicator)
            val.value = '(' + val.value + ') / ' + toFloat(unit.multiplicator)
          if (unit?.adder) val.value = '(' + val.value + ') - ' + unit.adder
        }
      })
    })
  })
}

/**
 * Check units
 * @param configuration Configuration
 */
const checkUnits = (configuration: IModel['configuration']): void => {
  // Mesh parameters
  checkMeshUnits(configuration)

  // Materials
  checkMaterialsUnits(configuration)

  // Parameters
  checkParametersUnits(configuration)

  // Initialization
  checkInitializationUnits(configuration)

  // Boundary conditions
  checkBoundaryConditionsUnits(configuration)
}

/**
 * Check cloud server
 * @param user User
 * @param simulation Simulation
 * @param configuration Configuration
 * @returns
 */
const checkCloudServer = async (
  user: { id: string },
  simulation: { id: string },
  configuration: IModel['configuration']
): Promise<HPCServerPlugin | undefined> => {
  const cloudServer = configuration.run.cloudServer
  if (!cloudServer) {
    returnError(simulation, configuration, 'Cloud server unavailable')
    return
  }

  // Find plugin
  const serverPlugins = await Plugins.serverList()
  const serverPlugin = serverPlugins.find((p) => p.key === cloudServer.key)

  // Check plugin
  if (!serverPlugin) {
    returnError(simulation, configuration, 'Unavailable plugin')
    return
  }

  // Update plugin configuration
  const userData = await User.get(user.id, ['authorizedplugins', 'plugins'])
  if (!userData) throw new Error('User not found')
  const userPlugin = userData.plugins.find((p) => p.uuid === cloudServer.uuid)
  if (userPlugin) cloudServer.configuration = userPlugin.configuration

  // Check authorized
  if (!userData.authorizedplugins?.includes(serverPlugin.key)) {
    returnError(simulation, configuration, 'Unauthorized')
    return
  }

  return serverPlugin as HPCServerPlugin
}

/**
 * Run
 * @param user User
 * @param simulation Simulation
 * @param keepMesh Keep mesh
 */
const run = async (
  user: { id: string },
  simulation: { id: string },
  keepMesh?: boolean
): Promise<void> => {
  const simulationData = await get(simulation.id, ['scheme'])
  if (!simulationData) return

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

  // Cloud server
  const serverPlugin = await checkCloudServer(user, simulation, configuration)
  if (!serverPlugin) return

  // Create run path
  await Tools.createPath(path.join(SIMULATION, simulation.id, 'run'))

  // Copy geometry
  await copyGeometries(simulation, configuration)

  // Check coupling
  if (configuration.initialization?.value) {
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
  forEachBoundaryConditions(
    configuration.boundaryConditions,
    (boundaryCondition) => {
      boundaryCondition.values?.forEach((value) => {
        value.labels = value.selected
          .map((s) => s.label)
          .filter((s) => s)
          .join(', ')
      })
    }
  )

  // Units
  checkUnits(configuration)

  // Compute
  try {
    await serverPlugin.lib.computeSimulation(
      simulation,
      simulationData.scheme,
      keepMesh
    )

    configuration.run = {
      ...configuration.run,
      done: true
    }
    await update(simulation, [
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
  } catch (err: any) {
    returnError(simulation, configuration, err.message)
  }
}

/**
 * Stop
 * @param simulation Simulation
 */
const stop = async (simulation: { id: string }): Promise<void> => {
  const simulationData = await get(simulation.id, ['scheme', 'tasks'])
  if (!simulationData) return

  // Global
  const configuration = simulationData.scheme?.configuration
  if (!configuration) return

  const tasks = simulationData.tasks

  // Find plugin
  const pluginsLibs = await Plugins.serverList()
  const pluginLib = (
    pluginsLibs.find(
      (p) => p.key === configuration.run.cloudServer?.key
    ) as HPCServerPlugin
  ).lib

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
 * @param simulation Simulation
 */
const copy = async (simulation: {
  id: string
}): Promise<INewSimulation | undefined> => {
  // Get data
  const data = await get(simulation.id, ['name', 'scheme', 'project'])
  if (!data) return

  // Update configuration
  data.scheme.configuration.run.done = false
  data.scheme.configuration.run.error = undefined

  // New simulation
  const newSimulation = await add(
    { id: data.project },
    { name: data.name + ' (Copy)', scheme: data.scheme }
  )

  // Return
  return newSimulation
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
