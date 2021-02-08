import path from 'path'
import FormData from 'form-data'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import Template from '@/lib/template'
import Tools from '@/lib/tools'

import Services from '@/services'

import call from './call'

// Plugin key
const key = 'rescale'

// dB update delay
const updateDelay = 1000 // ms

// Log file name
const logFileName = 'process_output.log'

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

  const freefem = await getFreeFEM(configuration)

  return {
    data: {
      coreTypes: coreTypes.results,
      freefem: freefem
    }
  }
}

/**
 * Get FreeFEM
 * @param {Object} configuration Configuration
 */
const getFreeFEM = async (configuration) => {
  // Get "analyses"
  const analyses = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'analyses/'
  })

  const freefem = analyses.results.find(
    (analysis) => analysis.code === 'freefem'
  )

  return freefem
}

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
 */
const computeMesh = async () => {}

/**
 * Compute simulation
 * @param {Object} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, algorithm, configuration) => {
  // Create tasks
  const tasks = []
  const simulationTask = {
    type: 'simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)

  try {
    // Path
    const simulationPath = path.join(storage.SIMULATION, id)

    // Cloud configuration
    const cloudConfiguration = configuration.run.cloudServer.configuration
    const cloudParameters = configuration.run.cloudServer.inUseConfiguration

    // Update tasks
    updateTasks(id, tasks)

    // Upload geometries
    const geometries = []
    await Promise.all(
      Object.keys(configuration).map(async (ckey) => {
        if (configuration[ckey].meshable !== undefined) {
          const geometry = configuration[ckey]

          // Task
          simulationTask.log += 'Uploading geometry...\n'
          updateTasks(id, tasks)

          // Upload
          const file = await uploadFile(
            cloudConfiguration,
            { id },
            path.join(ckey, geometry.file.fileName)
          )

          // Save
          geometries.push(file)
        }
      })
    )

    // Meshing
    const meshes = []
    // TODO, not needed for Denso
    await Promise.all(
      Object.keys(configuration).map(async (ckey) => {
        if (configuration[ckey].meshable) {
          // const geometry = configuration[ckey]

          // Task
          const meshingTask = {
            type: 'mesh',
            log: '',
            status: 'wait'
          }
          tasks.push(meshingTask)
          updateTasks(id, tasks)

          // TODO build mesh
          const mesh = {
            fileName: 'rc-upload-1611321997697-6.STEP.msh',
            originPath: 'geometry_mesh',
            part: 'part',
            partPath: 'partPath'
          }

          // Upload
          meshingTask.log += 'Uploading...\n'
          updateTasks(id, tasks)

          const file = await uploadFile(
            cloudConfiguration,
            { id },
            path.join(mesh.originPath, mesh.fileName)
          )
          meshes.push(file)

          // Task
          meshingTask.status = 'finish'
          meshingTask.file = mesh
          updateTasks(id, tasks)

          // Save mesh name
          mesh.originPath = '.' // TODO put that in simulation script render
          configuration[ckey].mesh = mesh
        }
      })
    )

    // Build the simulation script
    await Template.render(
      './templates/' + algorithm + '.edp.ejs',
      {
        ...configuration,
        dimension: 3,
        run: {
          ...configuration.run,
          path: 'result'
        }
      },
      {
        location: path.join(simulationPath, 'run'),
        name: id + '.edp'
      }
    )

    // Upload files
    // Task
    simulationTask.log += 'Uploading script...\n'
    updateTasks(id, tasks)

    const edp = await uploadFile(
      cloudConfiguration,
      { id },
      path.join('run', id + '.edp')
    )

    // Create job
    simulationTask.log += 'Create job...\n'
    updateTasks(id, tasks)
    const jobId = await createJob(
      algorithm,
      cloudConfiguration,
      cloudParameters,
      geometries,
      meshes,
      edp
    )

    // Submit job
    simulationTask.log += 'Submit job...\n'
    simulationTask.pid = jobId
    updateTasks(id, tasks)
    await submitJob(cloudConfiguration, jobId)
    simulationTask.log += 'Starting cluster...\n'
    updateTasks(id, tasks)

    // log & results
    let status
    const currentLog = simulationTask.log
    while (status !== 'Completed') {
      status = await getStatus(cloudConfiguration, jobId)
      console.log(status)

      if (status === 'Executing') {
        // Check in-run files
        const inRunFiles = await getInRunFiles(cloudConfiguration, jobId)

        // Log
        const logFile = inRunFiles.find((f) => f.path === logFileName)
        if (logFile) {
          const log = await getInRunFile(cloudConfiguration, logFile)
          simulationTask.log = currentLog + log
        }

        // Results
        // const resultFiles = inRunFiles.filter((f) => f.path.includes('result/'))
        // await Promise.all(
        //   resultFiles.map(async (resultFile) => {
        //     const result = await getFile(cloudConfiguration, resultFile.id)
        //     const fileName = resultFile.path.replace('result/')
        //     await Tools.writeFile(
        //       path.join(storage.SIMULATION, id, 'run'),
        //       fileName,
        //       result
        //     )
        //   })
        // )
      } else if (status === 'Completed') {
        const files = await getFiles(cloudConfiguration, jobId)

        // Log
        const logFile = files.find((f) => f.relativePath === logFileName)
        if (logFile) {
          const log = await getFile(cloudConfiguration, logFile.id)
          simulationTask.log = currentLog + log
        }

        // Results
        const resultFiles = files.filter((f) =>
          f.relativePath.includes('result/')
        )
        await Promise.all(
          resultFiles.map(async (resultFile) => {
            const result = await getFile(cloudConfiguration, resultFile.id)
            const fileName = resultFile.relativePath.replace('result/', '')
            await Tools.writeFile(
              path.join(storage.SIMULATION, id, 'run'),
              fileName,
              result
            )

            if (fileName.includes('.vtu')) {
              const resFile = fileName
              const partPath = resFile.replace('.vtu')

              const results = []

              try {
                const resCode = await Services.toThree(
                  path.join(storage.SIMULATION, id),
                  path.join('run', resFile),
                  path.join('run', partPath),
                  ({ error: resError, data: resData }) => {
                    if (resError) {
                      simulationTask.log += 'Warning: ' + resError
                      updateTasks(id, tasks)
                    }

                    if (resData) {
                      try {
                        const jsonData = JSON.parse(resData)
                        results.push(jsonData)
                      } catch (err) {
                        simulationTask.log += 'Warning: ' + err.message
                        updateTasks(id, tasks)
                      }
                    }
                  }
                )

                if (resCode !== 0) {
                  simulationTask.log +=
                    'Warning: Result converting process failed. Code ' + resCode
                  updateTasks(id, tasks)
                } else {
                  simulationTask.files = [
                    ...(simulationTask.files || []),
                    ...results.map((result) => ({
                      fileName: resFile,
                      originPath: 'run',
                      name: result.name,
                      part: 'part.json',
                      partPath: result.path
                    }))
                  ]

                  updateTasks(id, tasks)
                }
              } catch (err) {
                simulationTask.log += 'Warning: ' + err.message
                updateTasks(id, tasks)
              }
            }
          })
        )
      }

      updateTasks(id, tasks)
      await new Promise((resolve) => {
        setTimeout(resolve, updateDelay)
      })
    }

    simulationTask.status = 'finish'
    updateTasks(id, tasks)
  } catch (err) {
    // Task
    simulationTask.status = 'error'
    simulationTask.log += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

/**
 * Upload file
 * @param {Object} configuration Configuration
 * @param {Object} simulation Simulation { id }
 * @param {string} fileName File name
 */
const uploadFile = async (configuration, { id }, fileName) => {
  const filePath = path.join(storage.SIMULATION, id, fileName)
  const fileContent = await Tools.readFile(filePath)

  const formData = new FormData()
  formData.append('file', fileContent.toString(), fileName)

  const file = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'files/contents/',
    method: 'POST',
    body: formData
  })

  // RESCALE API BUG
  // response content type is text/plain but the correct type is application/json
  const fileJson = JSON.parse(file)

  return {
    id: fileJson.id,
    name: fileJson.name
  }
}

/**
 * Create job
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 * @param {Object} parameters Parameters
 * @param {Array} geometries Geometries
 * @param {Array} meshes Meshes
 * @param {Object} edp Edp
 */
const createJob = async (
  algorithm,
  configuration,
  parameters,
  geometries,
  meshes,
  edp
) => {
  const name = 'Tanatloc - ' + algorithm
  const coreType = parameters.coreTypes.value
  const lowPriority = parameters.lowPriority.value
  const numberOfCores = parameters.numberOfCores.value
  const freefemVersion = parameters.freefemVersion.value
  const job = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'jobs/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      isLowPriority: lowPriority,
      jobanalyses: [
        {
          analysis: {
            code: 'freefem',
            versionName: freefemVersion
          },
          hardware: {
            coreType: coreType,
            coresPerSlot: numberOfCores
          },
          command:
            'mkdir -p result && mkdir -p data && mpirun -np ' +
            numberOfCores +
            ' FreeFem++-mpi -ns ' +
            edp.name +
            ' unknowncommand',
          inputFiles: [
            ...geometries.map((g) => ({ id: g.id })),
            ...meshes.map((m) => ({ id: m.id })),
            { id: edp.id }
          ]
        }
      ]
    })
  })

  // Assign project if any
  if (configuration.organization && configuration.project) {
    try {
      await call({
        platform: configuration.platform.value,
        token: configuration.token.value,
        route:
          'organizations/' +
          configuration.organization.value +
          '/jobs/' +
          job.id +
          '/project-assignment/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId: configuration.project.value })
      })
    } catch (err) {
      console.warn(err)
      //TODO sentry
    }
  }

  return job.id
}

/**
 * Submit job
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */
const submitJob = async (configuration, id) => {
  await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'jobs/' + id + '/submit/',
    method: 'POST'
  })
}

/**
 * Get job status
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */
const getStatus = async (configuration, id) => {
  const status = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'jobs/' + id + '/statuses/'
  })

  const sorted = status.results.sort((a, b) => b.statusDate - a.statusDate)

  return sorted[0].status
}

/**
 * Get in-run files
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */
const getInRunFiles = async (configuration, id) => {
  const list = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'jobs/' + id + '/runs/1/directory-contents/'
  })

  return Array.isArray(list) ? list : []
}

/**
 * Get in-run file
 * @param {Object} configuration Configuration
 * @param {Object} file File
 */
const getInRunFile = async (configuration, file) => {
  const route = file.resource.replace('/api/v2/', '')
  const content = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route
  })

  console.log(content)

  return content
}

/**
 * Get files
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */
const getFiles = async (configuration, id) => {
  const list = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'jobs/' + id + '/runs/1/files/'
  })

  return list.results
}

/**
 * Get file
 * @param {Object} configuration
 * @param {string} id File id
 */
const getFile = async (configuration, id) => {
  const content = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'files/' + id + '/contents/'
  })

  return content
}

export default { key, init, computeMesh, computeSimulation }
