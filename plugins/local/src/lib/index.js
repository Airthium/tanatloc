import path from 'path'
import { setIntervalAsync } from 'set-interval-async/fixed'
import { clearIntervalAsync } from 'set-interval-async'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

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

// Time
const start = Date.now()

/**
 * Update tasks
 * @memberof Plugins.Local
 * @param {string} id Id
 * @param {Array} tasks Tasks
 */
const updateTasks = (id, tasks) => {
  SimulationDB.update({ id }, [
    {
      key: 'tasks',
      value: tasks
    }
  ])
}

/**
 * Clean previous simulaton
 * @memberof Plugins.Local
 * @param {string} simulationPath Simulation path
 */
const clean = async (simulationPath) => {
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

  // Run path
  try {
    await Tools.removeDirectory(path.join(simulationPath, runPath))
  } catch (err) {}
}

/**
 * Compute mesh
 * @memberof Plugins.Local
 * @param {string} simulationPath Simulation path
 * @param {Object} geometry Geometry `{ path, file, name }`
 * @param {Object} mesh Mesh `{ path, parameters }`
 * @param {Function} callback Callback
 * @returns {Object} Mesh `{ type, fileName, originPath, renderPath, json, glb }`
 */
const computeMesh = async (simulationPath, geometry, mesh, callback) => {
  const geoFile = geometry.name + '.geo'
  const mshFile = geometry.name + '.msh'
  const partPath = geometry.name

  // Render template
  await Template.render(
    'gmsh3D',
    {
      ...mesh.parameters,
      geometry: path.join('..', geometry.path, geometry.file)
    },
    {
      location: path.join(simulationPath, mesh.path),
      name: geoFile
    }
  )

  // Compute mesh
  let code = await Services.gmsh(
    simulationPath,
    path.join(mesh.path, geoFile),
    path.join(mesh.path, mshFile),
    ({ pid, data, error }) => callback({ pid, data, error })
  )

  if (code !== 0) throw new Error('Meshing process failed. Code ' + code)

  // Convert mesh
  const three = await Tools.convert(
    path.join(simulationPath, mesh.path),
    {
      name: mshFile,
      target: partPath
    },
    ({ data, error }) => callback({ data, error })
  )

  return {
    type: 'mesh',
    fileName: mshFile,
    originPath: mesh.path,
    renderPath: mesh.path,
    json: three.json,
    glb: three.glb
  }
}

/**
 * Get refinements
 * @memberof Plugins.Local
 * @param {Object} configuration Configuration
 * @returns {Array} Refinements
 */
const getRefinements = (configuration) => {
  const refinements = []
  configuration.boundaryConditions &&
    Object.keys(configuration.boundaryConditions).forEach((boundaryKey) => {
      if (
        boundaryKey === 'index' ||
        boundaryKey === 'title' ||
        boundaryKey === 'done'
      )
        return
      const boundaryCondition = configuration.boundaryConditions[boundaryKey]
      if (boundaryCondition.values && boundaryCondition.refineFactor) {
        refinements.push({
          size: 'factor',
          factor: boundaryCondition.refineFactor,
          selected: boundaryCondition.values.flatMap((v) => v.selected)
        })
      }
    })

  return refinements
}

/**
 * Compute meshes
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {string} simulationPath Simulation path
 * @param {Object} configuration Configuration
 * @param {Array} tasks Tasks
 */
const computeMeshes = async (id, simulationPath, configuration, tasks) => {
  let taskIndex = 0
  await Promise.all(
    Object.keys(configuration).map(async (ckey) => {
      if (configuration[ckey].meshable) {
        const geometry = configuration[ckey]

        // Task
        const meshingTask = {
          index: taskIndex++,
          label: 'Mesh',
          log: '',
          warning: '',
          error: '',
          status: 'wait'
        }
        tasks.push(meshingTask)
        updateTasks(id, tasks)

        if (configuration.initialization?.value?.type === 'coupling') {
          // Build not needed
          configuration[ckey].mesh = {}
          meshingTask.log += 'Coupling: skip mesh build'
          meshingTask.status = 'finish'
          updateTasks(id, tasks)
          return
        }

        // Check refinements
        const refinements = getRefinements(configuration)

        // Mesh parameters
        const parameters = {
          size: 'auto',
          fineness: 'normal',
          refinements: refinements
        }

        // Build mesh
        try {
          const mesh = await computeMesh(
            simulationPath,
            {
              path: path.join(geometry.path),
              file: geometry.file,
              name: geometry.name
            },
            {
              path: path.join(geometry.name + '_mesh'),
              parameters
            },
            ({ pid, error, data }) => {
              meshingTask.status = 'process'

              pid && (meshingTask.pid = pid)

              error && (meshingTask.error += 'Error: ' + error + '\n')

              data && (meshingTask.log += data + '\n')

              if ((Date.now() - start) % updateDelay === 0)
                updateTasks(id, tasks)
            }
          )

          // Task
          meshingTask.status = 'finish'
          meshingTask.file = mesh
          updateTasks(id, tasks)

          // Save mesh name
          configuration[ckey].mesh = mesh
        } catch (err) {
          // Task
          meshingTask.status = 'error'
          meshingTask.error += 'Fatal error: ' + err.message
          updateTasks(id, tasks)

          throw err
        }
      }
    })
  )
}

/**
 * Compute simulation
 * @memberof Plugins.Local
 * @param {string} simulation Simulation `{ id }`
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, algorithm, configuration) => {
  // Path
  const simulationPath = path.join(storage.SIMULATION, id)

  // Clean previous simulation
  await clean(simulationPath)

  // Create tasks
  const tasks = []

  // Meshes
  await computeMeshes(id, simulationPath, configuration, tasks)

  const simulationTask = {
    index: tasks.length,
    label: 'Simulation',
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
      algorithm,
      {
        ...configuration,
        dimension: 3,
        run: {
          ...configuration.run,
          couplingPath: path.join(runPath, couplingPath),
          resultPath: path.join(runPath, resultPath),
          dataPath: path.join(runPath, dataPath)
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
    startProcess(id, simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    )
    const code = await Services.freefem(
      simulationPath,
      path.join(runPath, id + '.edp'),
      async ({ pid, error }) => {
        simulationTask.status = 'process'

        pid && (simulationTask.pid = pid)

        error && (simulationTask.error += 'Error: ' + error + '\n')

        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
      }
    )

    await stopProcess(id, simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    )

    // check code
    if (code !== 0) throw new Error('Simulating process failed. Code ' + code)

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)
  } catch (err) {
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
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {*} _ Unused
 * @param {Array} tasks Tasks
 * @param {Object} simulationTask Simulation task
 */
const monitoring = async (id, _, tasks, simulationTask) => {
  const simulationPath = path.join(storage.SIMUALTION, id)
  await stopProcess(id, simulationPath, simulationTask, () =>
    updateTasks(id, tasks)
  )
}

const interval = {}
const results = {}
const datas = {}

/**
 * Start process results & datas
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 * @returns {string} Interval id
 */
const startProcess = (id, simulationPath, task, update) => {
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
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */
const stopProcess = async (id, simulationPath, task, update) => {
  interval[id] && clearIntervalAsync(interval[id])

  await processOutput(id, simulationPath, task, update)
}

/**
 * Process results & datas
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */
const processOutput = async (id, simulationPath, task, update) => {
  // Log
  try {
    const log = await Tools.readFile(path.join(simulationPath, logFileName))
    task.log = log.toString()
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
    await processData(id, dataLines, simulationPath, task, update)
  } catch (err) {}
}

/**
 * Process results
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {Array} resultLines Result lines
 * @param {string} simulationPath Simulation path
 * @param {Object} task Task
 * @param {Function} update Update task
 */
const processResults = async (
  id,
  resultLines,
  simulationPath,
  task,
  update
) => {
  // Get result
  await Promise.all(
    resultLines.map(async (line) => {
      // Already existing result
      if (results[id].includes(line)) return
      results[id].push(line)

      // New result
      const resFile = line.replace('PROCESS VTU FILE', '').trim()
      const partPath = resFile.replace('.vtu', '')

      try {
        // Convert
        let convertData = ''
        let convertError = ''
        await Tools.convert(
          path.join(simulationPath, runPath, resultPath),
          {
            name: resFile,
            target: partPath
          },
          ({ data, error }) => {
            data && (convertData += data)
            error && (convertError += error)
          },
          { isResult: true }
        )

        if (convertError) {
          task.warning +=
            'Warning: Result converting process failed (' + convertError + ')\n'
          update()

          // Remove line from existing results
          const index = results[id].findIndex((l) => l === line)
          results[id].splice(index, 1)

          return
        }

        // Add to task
        const newResults = convertData
          ?.trim()
          ?.split('\n')
          .map((res) => JSON.parse(res))

        task.files = [
          ...(task.files || []),
          ...newResults.map((result) => ({
            type: 'result',
            fileName: resFile,
            originPath: path.join(runPath, resultPath),
            name: result.name,
            json: result.path,
            glb: result.path + '.glb'
          }))
        ]
        update()
      } catch (err) {
        console.error(err)
        task.warning +=
          'Warning: Unable to convert result file (' + err.message + ')\n'
        update()

        // Remove line from existing results
        const index = results[id].findIndex((l) => l === line)
        results[id].splice(index, 1)
      }
    })
  )
}

/**
 * Process data
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {Array} dataLines Data lines
 * @param {string} simulationPath Simulation path
 * @param {Object} task Task
 * @param {Function} update Update task
 */
const processData = async (id, dataLines, simulationPath, task, update) => {
  // Get data
  await Promise.all(
    dataLines.map(async (line) => {
      // Already existing data
      if (datas[id].includes(line)) return
      datas[id].push(line)

      // New data
      const dataFile = line.replace('PROCESS DATA FILE', '').trim()

      try {
        // Read file
        const dPath = path.join(simulationPath, runPath, dataPath, dataFile)
        const dContent = await Tools.readFile(dPath)

        // Add to tasks
        task.datas = [...(task.datas || []), JSON.parse(dContent.toString())]
        update()
      } catch (err) {
        task.warning +=
          'Warning: Unable to read data file (' + err.message + ')\n'
        update()

        // Remove line from existing datas
        const index = datas[id].findIndex((l) => l === line)
        datas[id].splice(index, 1)
      }
    })
  )
}

/**
 * Stop tasks
 * @memberof Plugins.Local
 * @param {string} id Simulation id
 * @param {Array} tasks Tasks
 */
const stop = async (id, tasks) => {
  interval[id] && clearIntervalAsync(interval[id])

  tasks?.forEach((task) => {
    if (task?.status === 'wait' || task?.status === 'process')
      task.pid && process.kill(task.pid)
  })
}

export default {
  // Must be exported for each plugin
  key,
  computeMesh,
  computeSimulation,
  monitoring,
  stop,
  // Can be used in other plugins
  updateTasks,
  clean,
  startProcess,
  stopProcess,
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
