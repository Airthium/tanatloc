import path from 'path'

import storage from '@/config/storage'

import Template from '@/lib/template'
import Tools from '@/lib/tools'

import call from './call'
import {
  getFreeFEM,
  checkFiles,
  updateTasks,
  uploadFile,
  uploadFiles,
  createJob,
  submitJob,
  getStatus,
  getInRunFiles,
  getInRunFile,
  getFiles,
  getFile,
  getInRunOutputs,
  getOutputs
} from './tools'

// Plugin key
const key = 'rescale'

// dB update delay
const updateDelay = 1000 // ms

// Log file name
const logFileName = 'process_log.log'
const processFileName = 'process_data.log'

/**
 * Initialization
 * @param {Object} configuration Configuration
 */
const init = async (configuration) => {
  // Get coretypes
  const coreTypes = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'coretypes/?page_size=50'
  })

  // Check token
  if (coreTypes.detail === 'Invalid token.') throw new Error(coreTypes.detail)

  // Check for files
  await checkFiles(configuration)

  // Get FreeFEM
  const freefem = await getFreeFEM(configuration)

  return {
    data: {
      coreTypes: coreTypes.results,
      freefem: freefem,
      walltime: configuration.walltime.value
    }
  }
}

/**
 * Compute simulation
 * @param {Object} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, algorithm, configuration) => {
  // Path
  const simulationPath = path.join(storage.SIMULATION, id)
  const couplingPath = 'coupling'
  const resultPath = 'result'
  const dataPath = 'data'

  // Create tasks
  const tasks = []
  const simulationTask = {
    index: 0,
    label: 'Rescale',
    log: '',
    warning: '',
    error: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  try {
    // Cloud configuration
    const customLogFileName = configuration.run.logFile
    const cloudConfiguration = configuration.run.cloudServer.configuration
    const cloudParameters = configuration.run.cloudServer.inUseConfiguration

    // Result & data directories
    await Tools.createPath(path.join(simulationPath, 'run', couplingPath))
    await Tools.createPath(path.join(simulationPath, 'run', resultPath))
    await Tools.createPath(path.join(simulationPath, 'run', dataPath))

    // Command
    let command = 'mkdir -p coupling && mkdir -p result && mkdir -p data '

    // Upload geometries
    simulationTask.log += 'Uploading geometry...\n'
    updateTasks(id, tasks)

    const geometryFiles = Object.keys(configuration).map((ckey) => {
      if (configuration[ckey].meshable !== undefined) {
        const geometry = configuration[ckey]
        return {
          name: geometry.name,
          path: path.join(storage.SIMULATION, id, geometry.path, geometry.file)
        }
      }
    })

    const geometries = await uploadFiles(
      cloudConfiguration,
      geometryFiles.filter((f) => f),
      simulationTask
    )

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Upload coupling data
    let couplings = []
    if (configuration.initialization?.value?.type === 'coupling') {
      simulationTask.log += 'Uploading coupling data...\n'
      updateTasks(id, tasks)

      couplings = await uploadFiles(
        cloudConfiguration,
        [
          {
            name: 'initialization data',
            path: path.join(
              simulationPath,
              configuration.initialization.value.dat
            )
          },
          {
            name: 'initialization mesh',
            path: path.join(
              simulationPath,
              configuration.initialization.value.mesh
            )
          }
        ],
        simulationTask
      )

      configuration.initialization.value = {
        type: 'coupling',
        dat: 'initialization.dat',
        mesh: 'initialization.mesh'
      }

      simulationTask.log += '\n'
      updateTasks(id, tasks)
    }

    // Gmsh scripts
    simulationTask.log += 'Build meshing scripts...\n'
    updateTasks(id, tasks)

    const gmshScripts = await Promise.all(
      Object.keys(configuration).map(async (ckey) => {
        if (configuration[ckey].meshable) {
          if (configuration.initialization?.value?.type === 'coupling') {
            configuration[ckey].mesh = {}
            return null
          } else {
            const geometry = configuration[ckey]

            const geoFile = geometry.name + '.geo'
            const meshFile = geometry.name + '.msh'
            const meshPath = geometry.name + '_mesh'
            const partPath = geometry.name

            // Task
            simulationTask.log += ' - ' + geoFile + '\n'
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
                  if (
                    boundaryCondition.values &&
                    boundaryCondition.refineFactor
                  ) {
                    refinements.push({
                      size: 'factor',
                      factor: boundaryCondition.refineFactor,
                      selected: boundaryCondition.values.flatMap(
                        (v) => v.selected
                      )
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

            // Render template
            await Template.render(
              'gmsh3D',
              {
                ...parameters,
                geometry: geometry.file
              },
              {
                location: path.join(simulationPath, meshPath),
                name: geoFile
              }
            )

            // Update command
            command +=
              '&& gmsh -3 ' +
              geoFile +
              ' -o ' +
              meshFile +
              ' -format msh2 -clcurv 10 '

            // Update configuration
            const mesh = {
              fileName: meshFile,
              originPath: 'geometry_mesh',
              renderPath: '.',
              part: 'part.json',
              partPath: path.join(meshPath, partPath)
            }
            configuration[ckey].mesh = mesh

            return {
              name: geoFile,
              path: path.join(storage.SIMULATION, id, meshPath, geoFile)
            }
          }
        }
      })
    )

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Upload gmsh scripts
    simulationTask.log += 'Uploading Gmsh scripts...\n'
    updateTasks(id, tasks)

    const meshes = await uploadFiles(
      cloudConfiguration,
      gmshScripts.filter((f) => f),
      simulationTask
    )

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Build the FreeFEM script
    simulationTask.log += 'Build FreeFEM script...\n'
    updateTasks(id, tasks)

    await Template.render(
      algorithm,
      {
        ...configuration,
        dimension: 3,
        run: {
          ...configuration.run,
          couplingPath: 'coupling',
          resultPath: 'result',
          dataPath: 'data'
        }
      },
      {
        location: path.join(simulationPath, 'run'),
        name: id + '.edp'
      }
    )

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Upload FreeFEM script
    simulationTask.log += 'Uploading FreeFEM script...\n'
    updateTasks(id, tasks)

    const edp = await uploadFile(
      cloudConfiguration,
      path.join(storage.SIMULATION, id, 'run', id + '.edp')
    )

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Update command
    const numberOfCores = cloudParameters.numberOfCores.value
    command +=
      '&& mpirun -np ' + numberOfCores + ' FreeFem++-mpi -ns ' + edp.name

    // Create job
    simulationTask.log += 'Create job...\n'
    updateTasks(id, tasks)

    const jobId = await createJob(
      id,
      algorithm,
      cloudConfiguration,
      cloudParameters,
      command,
      geometries,
      couplings,
      meshes,
      edp
    )

    if (jobId.error) {
      simulationTask.error += ' Fatal error: ' + JSON.stringify(jobId) + '\n'
      updateTasks(id, tasks)
    }

    simulationTask.log += ' - Job id: ' + jobId + '\n'
    updateTasks(id, tasks)

    // Submit job
    simulationTask.log += 'Submit job...\n'
    simulationTask.pid = jobId
    updateTasks(id, tasks)

    await submitJob(cloudConfiguration, jobId)

    simulationTask.log += '\n'
    updateTasks(id, tasks)

    // Waiting for start
    simulationTask.log += 'Starting cluster...\n'
    updateTasks(id, tasks)

    // Monitoring
    let status
    const currentLog = simulationTask.log
    const results = []
    const datas = []
    couplings = []
    while (status !== 'Completed') {
      status = await getStatus(cloudConfiguration, jobId)

      if (status === 'Executing') {
        // Check in-run files
        const inRunFiles = await getInRunFiles(cloudConfiguration, jobId)

        // Log
        const logFile = inRunFiles.find((f) =>
          f.path.includes(customLogFileName || logFileName)
        )
        if (logFile) {
          const log = await getInRunFile(cloudConfiguration, logFile)
          if (typeof log === 'string') {
            // Log
            simulationTask.log = currentLog + log.replace(/\[.*\]: /g, '')
          }
        }

        // TODO get coupling data

        // Results / data
        const processFile = inRunFiles.find((f) =>
          f.path.includes(processFileName)
        )
        if (processFile) {
          const log = await getInRunFile(cloudConfiguration, processFile)
          if (typeof log === 'string') {
            // Check for results or data
            await getInRunOutputs(
              cloudConfiguration,
              log,
              inRunFiles,
              results,
              datas,
              couplings,
              simulationPath,
              path.join('run', resultPath),
              path.join('run', dataPath),
              path.join('run', couplingPath),
              simulationTask
            )
          }
        }
      } else if (status === 'Completed') {
        // Check files
        const files = await getFiles(cloudConfiguration, jobId)

        // Log
        const logFile = files.find((f) =>
          f.relativePath.includes(customLogFileName || logFileName)
        )
        if (logFile) {
          const log = await getFile(cloudConfiguration, logFile.id)
          if (typeof log === 'string') {
            // Log
            simulationTask.log = currentLog + log.replace(/\[.*\]: /g, '')
          }
        }

        // Results / data
        const processFile = files.find((f) =>
          f.relativePath.includes(processFileName)
        )
        if (processFile) {
          const log = await getFile(cloudConfiguration, processFile.id)
          if (typeof log === 'string') {
            // Check for results or data
            await getOutputs(
              cloudConfiguration,
              log,
              files,
              results,
              datas,
              couplings,
              simulationPath,
              path.join('run', resultPath),
              path.join('run', dataPath),
              path.join('run', couplingPath),
              simulationTask
            )
          }
        }
      }

      // Task
      updateTasks(id, tasks)

      // Wait
      await new Promise((resolve) => {
        setTimeout(resolve, updateDelay)
      })
    }

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)
  } catch (err) {
    // Task
    simulationTask.status = 'error'
    simulationTask.error += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

/**
 * Stop simulation
 * @param {Array} tasks Tasks
 * @param {Object} configuration Configuration
 */
const stop = async (tasks, configuration) => {
  const cloudConfiguration = configuration.run.cloudServer.configuration

  await Promise.all(
    tasks.map(async (task) => {
      if (task.status === 'wait' || task.status === 'process') {
        // Kill run, if any
        await call({
          platform: cloudConfiguration.platform.value,
          token: cloudConfiguration.token.value,
          method: 'POST',
          route: 'jobs/' + task.pid + '/run/1/stop/'
        })
        // Kill job
        await call({
          platform: cloudConfiguration.platform.value,
          token: cloudConfiguration.token.value,
          method: 'POST',
          route: 'jobs/' + task.pid + '/stop/'
        })
      }
    })
  )
}

export default { key, init, computeSimulation, stop }
