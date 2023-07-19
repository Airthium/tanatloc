/** @module Plugins.Local.Lib */

import path from 'path'
import { promises as fs } from 'fs'
import { execSync } from 'child_process'
import {
  setIntervalAsync,
  SetIntervalAsyncTimer
} from 'set-interval-async/fixed'
import { clearIntervalAsync } from 'set-interval-async'

import {
  IModel,
  IModelMeshRefinement,
  IModelTypedBoundaryCondition,
  IOutput
} from '@/models/index.d'
import { IClientPlugin } from '@/plugins/index.d'

import { SIMULATION } from '@/config/storage'

import SimulationDB, {
  ISimulation,
  ISimulationTask,
  ISimulationTaskFile
} from '@/database/simulation'

import Services from '@/services'

import Tools from '@/lib/tools'
import Template from '@/lib/template'
import Simulation from '@/lib/simulation'

// Plugin key
const key = 'local'

// Log file name
const logFileName = 'process_log.log'

// Results / data file name
const dataFileName = 'process_data.log'

// End file name
const endFileName = 'end.log'

// Paths
const runPath = 'run'
const couplingPath = 'coupling'
const resultPath = 'result'
const dataPath = 'data'

// dB update delay
const updateDelay = 1000 // ms

const init = async (
  configuration: IClientPlugin['configuration']
): Promise<void> => {
  // Check FreeFEM
  if (configuration.freefemPath.value) {
    try {
      await fs.access(configuration.freefemPath.value, fs.constants.X_OK)
    } catch (_err) {
      throw new Error('No access to FreeFEM executable')
    }
    try {
      execSync(configuration.freefemPath.value + ' --version')
    } catch (err: any) {
      throw new Error(
        'FreeFEM executable does not work properly (' + err.message + ')'
      )
    }
  }

  // Check Gmsh
  if (configuration.gmshPath.value) {
    try {
      await fs.access(configuration.gmshPath.value, fs.constants.X_OK)
    } catch (_err) {
      throw new Error('No access to GMSH executable')
    }
    try {
      execSync(configuration.gmshPath.value + ' --version')
    } catch (err: any) {
      throw new Error(
        'Gmsh executable does not work properly (' + err.mesage + ')'
      )
    }
  }
}

/**
 * Update tasks
 * @param id Id
 * @param tasks Tasks
 */
const updateTasks = (id: string, tasks: ISimulationTask[]): void => {
  ;(async () => {
    try {
      await SimulationDB.update({ id }, [
        {
          key: 'tasks',
          value: tasks
        }
      ])
    } catch (err) {}
  })()
}

/**
 * Clean previous simulaton
 * @param simulationPath Simulation path
 */
const clean = async (simulationPath: string): Promise<void> => {
  // Log file
  try {
    await Tools.removeFile(path.join(simulationPath, logFileName))
  } catch (err) {}

  // Data file
  try {
    await Tools.removeFile(path.join(simulationPath, dataFileName))
  } catch (err) {}

  // End file
  try {
    await Tools.removeFile(path.join(simulationPath, endFileName))
  } catch (err) {}

  // Run data path
  try {
    await Tools.removeDirectory(path.join(simulationPath, runPath, dataPath))
  } catch (err) {}

  // Run result path
  try {
    await Tools.removeDirectory(path.join(simulationPath, runPath, resultPath))
  } catch (err) {}
}

/**
 * Get refinements
 * @param boundaryConditions Boundary conditions
 * @returns Refinements
 */
const getRefinements = (
  boundaryConditions: IModel['configuration']['boundaryConditions']
): IModelMeshRefinement[] => {
  const refinements: IModelMeshRefinement[] = []
  boundaryConditions &&
    Object.keys(boundaryConditions).forEach((boundaryKey) => {
      if (
        boundaryKey === 'index' ||
        boundaryKey === 'title' ||
        boundaryKey === 'done'
      )
        return

      const boundaryCondition = boundaryConditions[
        boundaryKey
      ] as IModelTypedBoundaryCondition

      if (boundaryCondition.values?.length && boundaryCondition.refineFactor) {
        refinements.push({
          type: 'factor',
          factor: boundaryCondition.refineFactor,
          selected: boundaryCondition.values.flatMap((v) => v.selected)
        })
      }
    })

  return refinements
}

/**
 * Compute meshes
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param configuration Configuration
 * @param tasks Tasks
 */
const computeMeshes = async (
  id: string,
  simulationPath: string,
  configuration: IModel['configuration'],
  tasks: ISimulationTask[]
): Promise<void> => {
  const geometry = configuration.geometry
  if (!geometry.meshable) return

  const dimension = configuration.dimension
  const value = configuration.geometry.value
  const meshParameters = configuration.geometry.meshParameters
  const initialization = configuration.initialization
  const boundaryConditions = configuration.boundaryConditions
  const cloudServer = configuration.run.cloudServer

  if (geometry.multiple) {
    for (const data of geometry.datas!) {
      const mesh = await computeMesh(
        id,
        simulationPath,
        {
          dimension,
          geometry: { value, data, meshParameters },
          initialization,
          boundaryConditions,
          run: {
            cloudServer
          }
        },
        tasks
      )
      geometry.meshes = [...(geometry.meshes ?? []), mesh]
    }
  } else {
    const data = geometry.data
    const mesh = await computeMesh(
      id,
      simulationPath,
      {
        dimension,
        geometry: { value, data, meshParameters },
        initialization,
        boundaryConditions,
        run: {
          cloudServer
        }
      },
      tasks
    )
    geometry.mesh = mesh
  }
}

/**
 * Compute mesh
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param configuration Configuration
 * @param tasks Tasks
 */
const computeMesh = async (
  id: string,
  simulationPath: string,
  configuration: {
    dimension: IModel['configuration']['dimension']
    geometry: {
      value: IModel['configuration']['geometry']['value']
      data: IModel['configuration']['geometry']['data']
      meshParameters: IModel['configuration']['geometry']['meshParameters']
    }
    initialization: IModel['configuration']['initialization']
    boundaryConditions: IModel['configuration']['boundaryConditions']
    run: {
      cloudServer: IModel['configuration']['run']['cloudServer']
    }
  },
  tasks: ISimulationTask[]
): Promise<ISimulationTaskFile> => {
  // Time
  const start = Date.now()

  // Task
  const meshingTask: ISimulationTask = {
    index: tasks.length,
    label: 'Mesh (' + configuration.geometry.data?.name + ')',
    status: 'wait',
    pid: undefined,
    file: undefined,
    log: '',
    warning: '',
    error: ''
  }
  tasks.push(meshingTask)
  updateTasks(id, tasks)

  try {
    if (
      !configuration.geometry.data?.name ||
      !configuration.geometry.data.path ||
      !configuration.geometry.data.file
    )
      throw new Error('Missing data in geometry')

    if (configuration.initialization?.value?.type === 'coupling') {
      // Build not needed
      meshingTask.log += 'Coupling: skip mesh build'
      meshingTask.status = 'finish'
      updateTasks(id, tasks)
      return {} as ISimulationTaskFile
    }

    // Check refinements
    const refinements = getRefinements(configuration.boundaryConditions)

    // Mesh parameters
    if (!configuration.geometry.meshParameters)
      configuration.geometry.meshParameters = {
        type: 'auto',
        value: 'normal'
      }

    const parameters = {
      ...configuration.geometry.meshParameters,
      refinements: refinements
    }

    // Build mesh
    const geoFile = configuration.geometry.data.file + '.geo'
    const mshFile = configuration.geometry.data.file + '.msh'
    const meshPath = configuration.geometry.data.file + '_mesh'
    const partPath = configuration.geometry.data.file

    // Render template
    await Template.render(
      configuration.dimension === 2 ? 'gmsh2D' : 'gmsh3D',
      undefined,
      {
        ...parameters,
        geometry: Tools.toPosix(
          path.join(
            '..',
            configuration.geometry.data.path,
            configuration.geometry.data.file
          )
        )
      },
      {
        location: path.join(simulationPath, meshPath),
        name: geoFile
      }
    )

    // Callback
    const callback = ({
      pid,
      data,
      error
    }: {
      pid?: number
      data?: string
      error?: string
    }) => {
      meshingTask.status = 'process'

      pid && (meshingTask.pid = pid)

      error && (meshingTask.error += 'Error: ' + error + '\n')

      data && (meshingTask.log += data + '\n')

      if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
    }

    // Configuration
    const gmshPath =
      configuration.run.cloudServer?.configuration?.gmshPath?.value

    // Compute mesh
    let code = await Services.gmsh(
      simulationPath,
      path.join(meshPath, geoFile),
      path.join(meshPath, mshFile),
      ({ pid, data, error }) => callback({ pid, data, error }),
      gmshPath
    )

    if (code !== 0) throw new Error('Meshing process failed. Code ' + code)

    // Convert mesh
    const three = await Tools.convert(
      path.join(simulationPath, meshPath),
      {
        name: mshFile,
        target: partPath
      },
      ({ data, error }) => callback({ data, error })
    )

    // Mesh
    const mesh: ISimulationTaskFile = {
      type: 'mesh',
      fileName: mshFile,
      originPath: meshPath,
      renderPath: meshPath,
      glb: three[0].glb,
      geometry: configuration.geometry.value!
    }

    // Task
    meshingTask.status = 'finish'
    meshingTask.file = mesh
    updateTasks(id, tasks)

    return mesh
  } catch (err: any) {
    // Task
    meshingTask.status = 'error'
    meshingTask.error += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

/**
 * Compute simulation
 * @param simulation Simulation
 * @param scheme Simulation scheme
 */
const computeSimulation = async (
  { id }: { id: string },
  scheme: ISimulation<'scheme'[]>['scheme'],
  keepMesh?: boolean
): Promise<void> => {
  // Check
  if (!scheme) throw new Error('Scheme is not defined')

  // Time
  const start = Date.now()

  // Path
  const simulationPath = path.join(SIMULATION, id)

  // Configuration
  const configuration = scheme.configuration

  // Get mesh tasks
  const simulationData = await Simulation.get(id, ['tasks'])
  const meshTasks = simulationData.tasks.filter(
    (task) => task.file?.type === 'mesh'
  )

  // Create tasks
  const tasks: ISimulationTask[] = keepMesh ? meshTasks : []
  updateTasks(id, tasks)

  // Clean previous simulation
  await clean(simulationPath)

  // Ensure dimension
  configuration.dimension ?? (configuration.dimension = 3)

  // Meshes
  if (!keepMesh) {
    await computeMeshes(id, simulationPath, configuration, tasks)
    // Save mesh/meshes for reuse
    await Simulation.update({ id }, [{ key: 'scheme', value: scheme }])
  }

  const simulationTask: ISimulationTask = {
    index: tasks.length,
    label: 'Simulation',
    pid: undefined,
    log: '',
    warning: '',
    error: '',
    status: 'wait',
    systemLog: 'log',
    plugin: key
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  try {
    // Build the simulation script
    await Template.render(
      scheme.algorithm,
      scheme.userModelId,
      {
        variables: scheme.variables,
        ...configuration,
        run: {
          ...configuration.run,
          couplingPath: Tools.toPosix(path.join(runPath, couplingPath)),
          resultPath: Tools.toPosix(path.join(runPath, resultPath)),
          dataPath: Tools.toPosix(path.join(runPath, dataPath))
        }
      },
      {
        location: path.join(simulationPath, runPath),
        name: id + '.edp'
      }
    )

    // Create paths
    await Tools.createPath(path.join(simulationPath, runPath, couplingPath))
    await Tools.createPath(path.join(simulationPath, runPath, resultPath))
    await Tools.createPath(path.join(simulationPath, runPath, dataPath))

    // Compute simulation
    Local.startProcess(id, simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    )
    const freefemPath =
      configuration.run.cloudServer?.configuration?.freefemPath?.value
    const code = await Services.freefem(
      simulationPath,
      path.join(runPath, id + '.edp'),
      ({ pid, error }) => {
        ;(async ({ pid, error }) => {
          simulationTask.status = 'process'

          pid && (simulationTask.pid = pid)

          error && (simulationTask.error += 'Error: ' + error + '\n')

          if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
        })({ pid, error })
      },
      freefemPath
    )

    await stopProcess(id, simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    )

    // check code
    if (code !== 0) throw new Error('Simulating process failed. Code ' + code)

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)
  } catch (err: any) {
    // Task
    simulationTask.status = 'error'
    simulationTask.error += 'Fatal error: ' + err.message
    stopProcess(id, simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    ).catch(console.warn)
    updateTasks(id, tasks)

    throw err
  }
}

/**
 * Monitoring
 * @param id Simulation id
 * @param _ Unused
 * @param tasks Tasks
 * @param simulationTask Simulation task
 */
const monitoring = async (
  id: string,
  _: any,
  tasks: ISimulationTask[],
  simulationTask: ISimulationTask
): Promise<void> => {
  await checkResults(id, simulationTask)
  await checkDatas(id, simulationTask)

  const simulationPath = path.join(SIMULATION, id)
  await stopProcess(id, simulationPath, simulationTask, () =>
    updateTasks(id, tasks)
  )

  simulationTask.status = 'finish'
  updateTasks(id, tasks)
}

const interval: { [key: string]: SetIntervalAsyncTimer<any> } = {}
const results: { [key: string]: string[] } = {}
const datas: { [key: string]: string[] } = {}

/**
 * Check results
 * @param id Simulation id
 * @param task Simulation task
 */
const checkResults = async (
  id: string,
  task: ISimulationTask
): Promise<string[]> => {
  const simulationPath = path.join(SIMULATION, id)

  results[id] = []

  if (task.files) {
    // Existing files
    const existingFiles = (
      await Tools.listFiles(path.join(simulationPath, runPath, resultPath))
    ).map((file) => file.name)

    // In task results
    const files = task.files
      .map((file) => {
        if (existingFiles.includes(file.fileName)) return file
      })
      .filter((f) => f) as ISimulationTaskFile[]

    // Update
    task.files = files
    results[id] = files.map((file) => file.fileName)
  }

  return results[id]
}

/**
 * Check datas
 * @param id Simulation id
 * @param task Simulation task
 */
const checkDatas = async (
  id: string,
  task: ISimulationTask
): Promise<string[]> => {
  const simulationPath = path.join(SIMULATION, id)

  datas[id] = []

  if (task.datas) {
    // Existing files
    const existingFiles = (
      await Tools.listFiles(path.join(simulationPath, runPath, resultPath))
    ).map((file) => file.name)

    // In task datas
    const files = task.datas
      .map((file) => {
        if (existingFiles.includes(file.fileName)) return file
      })
      .filter((f) => f) as ISimulationTask['datas']

    // Update
    task.datas = files
    datas[id] = files!.map((file) => file.fileName)
  }

  return datas[id]
}

/**
 * Start process results & datas
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param task Simulation task
 * @param update Update task
 * @returns Interval id
 */
const startProcess = (
  id: string,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): SetIntervalAsyncTimer<any> => {
  if (!interval[id]) {
    results[id] = []
    datas[id] = []
    interval[id] = setIntervalAsync(
      async () => processOutput(id, simulationPath, task, update),
      updateDelay
    )
  }

  return interval[id]
}

/**
 * Stop process results and datas
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param task Simulation task
 * @param update Update task
 */
const stopProcess = async (
  id: string,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  if (interval[id]) {
    await clearIntervalAsync(interval[id])
    delete interval[id]
  }

  await processOutput(id, simulationPath, task, update)
}

/**
 * Process results & datas
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param task Simulation task
 * @param update Update task
 */
const processOutput = async (
  id: string,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Log
  try {
    const log = await Tools.readFile(path.join(simulationPath, logFileName))
    task.log = log.toString()
    update()
  } catch (err) {}

  // Result / data
  try {
    const process = await Tools.readFile(
      path.join(simulationPath, dataFileName)
    )

    const lines = process.toString().split('\n')
    const JSONLines: IOutput[] = lines
      .filter((l) => l)
      .map((line) => JSON.parse(line))
    const resultOutputs = JSONLines.filter((l) => l.type === 'VTU')
    const dataOutputs = JSONLines.filter((l) => l.type === 'DATA')

    // Results
    await processResults(id, resultOutputs, simulationPath, task, update)

    // Data
    await processDatas(id, dataOutputs, simulationPath, task, update)
  } catch (err) {}
}

/**
 * Process result
 * @param id Id
 * @param result Result
 * @param simulationPath Simulation Path
 * @param task Task
 * @param update Update
 */
const processResult = async (
  id: string,
  result: IOutput,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Already existing result
  if (!results[id]) results[id] = []
  if (results[id].includes(result.name)) return
  results[id].push(result.name)

  // New result
  const resFile = result.name
  const partPath = resFile.replace('.vtu', '')
  try {
    // Convert
    const newResults = await Tools.convert(
      path.join(simulationPath, runPath, resultPath),
      {
        name: resFile,
        target: partPath
      },
      ({ error }) => {
        error &&
          (task.warning +=
            'Warning: Result converting process failed (' + error + ')\n')
      },
      { isResult: true }
    )
    update()

    // Add to task
    task.files = [
      ...(task.files ?? []),
      ...newResults.map((res) => ({
        type: 'result',
        fileName: resFile,
        originPath: path.join(runPath, resultPath),
        name: res.name,
        glb: res.glb,
        geometry: result.geometry,
        extra: result.extra
      }))
    ]
    update()
  } catch (err: any) {
    task.warning +=
      'Warning: Unable to convert result file (' + err.message + ')\n'
    update()

    // Remove line from existing results
    const index = results[id].findIndex((l) => l === result.name)
    results[id].splice(index, 1)
  }
}

/**
 * Process results
 * @param id Simulation id
 * @param resultOutputs Result outputs
 * @param simulationPath Simulation path
 * @param task Task
 * @param update Update task
 */
const processResults = async (
  id: string,
  resultOutputs: IOutput[],
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Get result
  await Promise.all(
    resultOutputs.map(async (output) =>
      processResult(id, output, simulationPath, task, update)
    )
  )
}

/**
 * Process data
 * @param id Id
 * @param data Data
 * @param simulationPath Simulation path
 * @param task Task
 * @param update Update
 */
const processData = async (
  id: string,
  data: IOutput,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Already existing data
  if (!datas[id]) datas[id] = []
  if (datas[id].includes(data.name)) return
  datas[id].push(data.name)

  // New data
  const dataFile = data.name

  try {
    // Read file
    const dPath = path.join(simulationPath, runPath, dataPath, dataFile)
    const dContent = await Tools.readFile(dPath)

    // Add to tasks
    task.datas = [
      ...(task.datas ?? []),
      {
        fileName: data.name,
        extra: data.extra,
        ...JSON.parse(dContent.toString())
      }
    ]
    update()
  } catch (err: any) {
    task.warning += 'Warning: Unable to read data file (' + err.message + ')\n'
    update()

    // Remove line from existing datas
    const index = datas[id].findIndex((l) => l === data.name)
    datas[id].splice(index, 1)
  }
}

/**
 * Process data
 * @param id Simulation id
 * @param dataOutputs Data outputes
 * @param simulationPath Simulation path
 * @param task Task
 * @param update Update task
 */
const processDatas = async (
  id: string,
  dataOutputs: IOutput[],
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Get data
  await Promise.all(
    dataOutputs.map(async (output) =>
      processData(id, output, simulationPath, task, update)
    )
  )
}

/**
 * Stop tasks
 * @param id Simulation id
 * @param tasks Tasks
 */
const stop = async (id: string, tasks: ISimulationTask[]): Promise<void> => {
  if (interval[id]) {
    await clearIntervalAsync(interval[id])
    delete interval[id]
  }

  tasks?.forEach((task) => {
    if (task.pid && (task?.status === 'wait' || task?.status === 'process'))
      try {
        process.kill(+task.pid)
      } catch (err) {}
  })
}

const Local = {
  // Must be exported for each plugin
  key,
  init,
  getRefinements,
  computeMeshes,
  computeMesh,
  computeSimulation,
  monitoring,
  stop,
  // Can be used in other plugins
  updateTasks,
  clean,
  checkResults,
  checkDatas,
  startProcess,
  stopProcess,
  processResult,
  processData,
  files: {
    log: logFileName,
    data: dataFileName,
    end: endFileName
  },
  paths: {
    run: runPath,
    coupling: couplingPath,
    result: resultPath,
    data: dataPath
  }
}
export default Local
