/** @module Plugins.Local.Lib */

import path from 'path'
import {
  setIntervalAsync,
  SetIntervalAsyncTimer
} from 'set-interval-async/fixed'
import { clearIntervalAsync } from 'set-interval-async'

import {
  IModel,
  IModelMeshRefinement,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { SIMULATION } from '@/config/storage'

import SimulationDB, {
  ISimulation,
  ISimulationTask,
  ISimulationTaskFile
} from '@/database/simulation'

import Services from '@/services'

import Tools from '@/lib/tools'
import Template from '@/lib/template'

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

/**
 * Update tasks
 * @param id Id
 * @param tasks Tasks
 */
const updateTasks = (id: string, tasks: ISimulationTask[]): void => {
  SimulationDB.update({ id }, [
    {
      key: 'tasks',
      value: tasks
    }
  ]).catch()
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
 * @param configuration Configuration
 * @returns Refinements
 */
const getRefinements = (
  configuration: IModel['configuration']
): IModelMeshRefinement[] => {
  const refinements: IModelMeshRefinement[] = []
  configuration.boundaryConditions &&
    Object.keys(configuration.boundaryConditions).forEach((boundaryKey) => {
      if (
        boundaryKey === 'index' ||
        boundaryKey === 'title' ||
        boundaryKey === 'done'
      )
        return

      const boundaryCondition = configuration.boundaryConditions[
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
 * Compute mesh
 * @param id Simulation id
 * @param simulationPath Simulation path
 * @param configuration Configuration
 * @param tasks Tasks
 */
const computeMesh = async (
  id: string,
  simulationPath: string,
  configuration: IModel['configuration'],
  tasks: ISimulationTask[]
): Promise<void> => {
  // Time
  const start = Date.now()

  const geometry = configuration.geometry
  if (!geometry.meshable) return

  // Task
  const meshingTask: ISimulationTask = {
    index: 0,
    label: 'Mesh',
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
    if (!geometry.name || !geometry.path || !geometry.file)
      throw new Error('Missing data in geometry')

    if (configuration.initialization?.value?.type === 'coupling') {
      // Build not needed
      geometry.mesh = {}
      meshingTask.log += 'Coupling: skip mesh build'
      meshingTask.status = 'finish'
      updateTasks(id, tasks)
      return
    }

    // Check refinements
    const refinements = getRefinements(configuration)

    // Mesh parameters
    if (!geometry.meshParameters)
      geometry.meshParameters = {
        type: 'auto',
        value: 'normal'
      }

    const parameters = {
      ...geometry.meshParameters,
      refinements: refinements
    }

    // Build mesh
    const geoFile = geometry.file + '.geo'
    const mshFile = geometry.file + '.msh'
    const meshPath = geometry.file + '_mesh'
    const partPath = geometry.file

    // Render template
    await Template.render(
      configuration.dimension === 2 ? 'gmsh2D' : 'gmsh3D',
      {
        ...parameters,
        geometry: Tools.toPosix(path.join('..', geometry.path, geometry.file))
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
      glb: three[0].glb
    }

    // Save mesh
    geometry.mesh = mesh

    // Task
    meshingTask.status = 'finish'
    meshingTask.file = mesh
    updateTasks(id, tasks)
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
  scheme: ISimulation<'scheme'[]>['scheme']
): Promise<void> => {
  // Check
  if (!scheme) throw new Error('Scheme is not defined')

  // Time
  const start = Date.now()

  // Path
  const simulationPath = path.join(SIMULATION, id)

  // Configuration
  const configuration = scheme.configuration

  // Create tasks
  const tasks: ISimulationTask[] = []
  updateTasks(id, tasks)

  // Clean previous simulation
  await clean(simulationPath)

  // Ensure dimension
  configuration.dimension ?? (configuration.dimension = 3)

  // Meshes
  await computeMesh(id, simulationPath, configuration, tasks)

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
      {
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
      async ({ pid, error }) => {
        simulationTask.status = 'process'

        pid && (simulationTask.pid = pid)

        error && (simulationTask.error += 'Error: ' + error + '\n')

        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
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
  checkResults(id, simulationTask)
  checkDatas(id, simulationTask)

  const simulationPath = path.join(SIMULATION, id)
  await stopProcess(id, simulationPath, simulationTask, () =>
    updateTasks(id, tasks)
  )

  simulationTask.status = 'finish'
  updateTasks(id, tasks)
}

const interval: { [key: string]: SetIntervalAsyncTimer } = {}
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
): SetIntervalAsyncTimer => {
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
    //@ts-ignore
    clearIntervalAsync(interval[id])
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
    const resultLines = lines.filter((l) => l.includes('PROCESS VTU FILE'))
    const dataLines = lines.filter((l) => l.includes('PROCESS DATA FILE'))

    // Results
    await processResults(id, resultLines, simulationPath, task, update)

    // Data
    await processDatas(id, dataLines, simulationPath, task, update)
  } catch (err) {
    console.error(err)
  }
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
  result: string,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Already existing result
  if (!results[id]) results[id] = []
  if (results[id].includes(result)) return
  results[id].push(result)

  // New result
  const resFile = result.replace('PROCESS VTU FILE', '').trim()
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
      ...(task.files || []),
      ...newResults.map((res) => ({
        type: 'result',
        fileName: resFile,
        originPath: path.join(runPath, resultPath),
        name: res.name,
        glb: res.glb
      }))
    ]
    update()
  } catch (err: any) {
    task.warning +=
      'Warning: Unable to convert result file (' + err.message + ')\n'
    update()

    // Remove line from existing results
    const index = results[id].findIndex((l) => l === result)
    results[id].splice(index, 1)
  }
}

/**
 * Process results
 * @param id Simulation id
 * @param resultLines Result lines
 * @param simulationPath Simulation path
 * @param task Task
 * @param update Update task
 */
const processResults = async (
  id: string,
  resultLines: string[],
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Get result
  await Promise.all(
    resultLines.map(async (line) =>
      processResult(id, line, simulationPath, task, update)
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
  data: string,
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Already existing data
  if (!datas[id]) datas[id] = []
  if (datas[id].includes(data)) return
  datas[id].push(data)

  // New data
  const dataFile = data.replace('PROCESS DATA FILE', '').trim()

  try {
    // Read file
    const dPath = path.join(simulationPath, runPath, dataPath, dataFile)
    const dContent = await Tools.readFile(dPath)

    // Add to tasks
    task.datas = [
      ...(task.datas || []),
      { fileName: data, ...JSON.parse(dContent.toString()) }
    ]
    update()
  } catch (err: any) {
    task.warning += 'Warning: Unable to read data file (' + err.message + ')\n'
    update()

    // Remove line from existing datas
    const index = datas[id].findIndex((l) => l === data)
    datas[id].splice(index, 1)
  }
}

/**
 * Process data
 * @param id Simulation id
 * @param dataLines Data lines
 * @param simulationPath Simulation path
 * @param task Task
 * @param update Update task
 */
const processDatas = async (
  id: string,
  dataLines: string[],
  simulationPath: string,
  task: ISimulationTask,
  update: () => void
): Promise<void> => {
  // Get data
  await Promise.all(
    dataLines.map(async (line) =>
      processData(id, line, simulationPath, task, update)
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
    //@ts-ignore
    clearIntervalAsync(interval[id])
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
  getRefinements,
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
