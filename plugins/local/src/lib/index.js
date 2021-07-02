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

// dB update delay
const updateDelay = 1000 // ms

// Results / data file name
const logFileName = 'process_log.log'
const processFileName = 'process_data.log'

/**
 * Update tasks
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
 * Compute mesh
 * @param {string} simulationPath Simulation path
 * @param {Object} geometry Geometry
 * @param {Object} mesh Mesh
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
    callback
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
 * Compute simulation
 * @param {string} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, algorithm, configuration) => {
  // Time
  const start = Date.now()

  // Path
  const simulationPath = path.join(storage.SIMULATION, id)

  // Create tasks
  const tasks = []

  // Meshing
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

        // Check refinements
        const refinements = []
        configuration.boundaryConditions &&
          Object.keys(configuration.boundaryConditions).forEach(
            (boundaryKey) => {
              if (
                boundaryKey === 'index' ||
                boundaryKey === 'title' ||
                boundaryKey === 'done'
              )
                return
              const boundaryCondition =
                configuration.boundaryConditions[boundaryKey]
              if (boundaryCondition.values && boundaryCondition.refineFactor) {
                refinements.push({
                  size: 'factor',
                  factor: boundaryCondition.refineFactor,
                  selected: boundaryCondition.values.flatMap((v) => v.selected)
                })
              }
            }
          )

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

  const simulationTask = {
    index: taskIndex++,
    label: 'Simulation',
    log: '',
    warning: '',
    error: '',
    status: 'wait'
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
          couplingPath: 'run/coupling',
          resultPath: 'run/result',
          dataPath: 'run/data'
        }
      },
      {
        location: path.join(simulationPath, 'run'),
        name: id + '.edp'
      }
    )

    // Create paths
    await Tools.createPath(path.join(simulationPath, 'run/coupling'))
    await Tools.createPath(path.join(simulationPath, 'run/result'))
    await Tools.createPath(path.join(simulationPath, 'run/data'))

    // Compute simulation
    const code = await Services.freefem(
      simulationPath,
      path.join('run', id + '.edp'),
      async ({ pid, error }) => {
        simulationTask.status = 'process'
        startProcess(simulationPath, simulationTask, () =>
          updateTasks(id, tasks)
        )

        pid && (simulationTask.pid = pid)

        error && (simulationTask.error += 'Error: ' + error + '\n')

        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
      }
    )

    await stopProcess(simulationPath, simulationTask, () =>
      updateTasks(id, tasks)
    )

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)

    // check code
    if (code !== 0) throw new Error('Simulating process failed. Code ' + code)
  } catch (err) {
    // Task
    simulationTask.status = 'error'
    simulationTask.error += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

let interval = null
const results = []
const datas = []

/**
 * Start process results & datas
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */
const startProcess = (simulationPath, task, update) => {
  if (!interval) {
    results.length = 0
    datas.length = 0
    interval = setIntervalAsync(
      async () => processOutput(simulationPath, task, update),
      1000
    )
  }
}

/**
 * Stop process results and datas
 */
const stopProcess = async (simulationPath, task, update) => {
  interval && clearIntervalAsync(interval)

  await processOutput(simulationPath, task, update)
}

/**
 * Process results & datas
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */
const processOutput = async (simulationPath, task, update) => {
  // Log
  try {
    const log = await Tools.readFile(path.join(simulationPath, logFileName))
    log && (task.log = log.toString())
  } catch (err) {
    console.warn(err)
  }

  // Result / data
  try {
    const process = await Tools.readFile(
      path.join(simulationPath, processFileName)
    )

    const lines = process.toString().split('\n')
    const resultLines = lines.filter((l) => l.includes('PROCESS VTU FILE'))
    const dataLines = lines.filter((l) => l.includes('PROCESS DATA FILE'))

    // Get result
    await Promise.all(
      resultLines.map(async (line) => {
        // Already existing result
        if (results.includes(line)) return

        // New result
        const resFile = line.replace('PROCESS VTU FILE', '').trim()
        const partPath = resFile.replace('.vtu', '')

        try {
          // Convert
          let convertData = ''
          let convertError = ''
          await Tools.convert(
            path.join(simulationPath, 'run', 'result'),
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
              'Warning: Result converting process failed (' +
              convertError +
              ')\n'
            update()
          } else {
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
                originPath: 'run/result',
                name: result.name,
                json: result.path,
                glb: result.path + '.glb'
              }))
            ]
            update()

            // Add to results
            results.push(line)
          }
        } catch (err) {
          console.error(err)
          task.warning +=
            'Warning: Unable to convert result file (' + err.message + ')\n'
          update()
        }
      })
    )

    // Get data
    await Promise.all(
      dataLines.map(async (line) => {
        // Already existing data
        if (datas.includes(line)) return

        // New data
        const dataFile = line.replace('PROCESS DATA FILE', '').trim()

        try {
          // Read file
          const dataPath = path.join(simulationPath, 'run', 'data', dataFile)
          const dataContent = await Tools.readFile(dataPath)

          // Add to tasks
          task.datas = [
            ...(task.datas || []),
            JSON.parse(dataContent.toString())
          ]
          update()

          // Add to datas
          datas.push(line)
        } catch (err) {
          task.warning +=
            'Warning: Unable to read data file (' + err.message + ')\n'
          update()
        }
      })
    )
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Stop tasks
 * @param {Array} tasks Tasks
 */
const stop = async (tasks) => {
  tasks.forEach((task) => {
    if (task.status === 'process') process.kill(task.pid)
  })
}

export default { key, computeMesh, computeSimulation, stop }
