import path from 'path'
import FormData from 'form-data'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import Template from '@/lib/template'
import Tools from '@/lib/tools'

import call from './call'

// Plugin key
const key = 'rescale'

// dB update delay
const updateDelay = 1000 // ms

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
  // Time
  const start = Date.now()

  // Path
  const simulationPath = path.join(storage.SIMULATION, id)

  // Cloud configuration
  const cloudConfiguration = configuration.run.cloudServer.configuration
  const cloudParameters = configuration.run.cloudServer.inUseConfiguration

  // Create tasks
  const tasks = []
  const simulationTask = {
    type: 'simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  // Upload geometries
  const geometries = []
  await Promise.all(
    Object.keys(configuration).map(async (ckey) => {
      if (configuration[ckey].meshable !== undefined) {
        const geometry = configuration[ckey]
        const file = await uploadFile(
          cloudConfiguration,
          { id },
          path.join(ckey, geometry.file.fileName)
        )

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
        // TODO build mesh
        configuration[ckey].mesh = {
          fileName: 'rc-upload-1611321997697-6.STEP.msh',
          originPath: 'geometry_mesh',
          part: 'part',
          partPath: 'partPath'
        }

        // Upload
        const file = await uploadFile(
          cloudConfiguration,
          { id },
          path.join(
            configuration[ckey].mesh.originPath,
            configuration[ckey].mesh.fileName
          )
        )
        meshes.push(file)

        configuration[ckey].mesh.originPath = '.'
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
  const edp = await uploadFile(
    cloudConfiguration,
    { id },
    path.join('run', id + '.edp')
  )

  // Create job
  const jobId = await createJob(
    algorithm,
    cloudConfiguration,
    cloudParameters,
    geometries,
    meshes,
    edp
  )

  // Submit job
  await submitJob(cloudConfiguration, jobId)
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
            'mpirun -np ' + numberOfCores + ' FreeFem++-mpi -ns ' + edp.name,
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
      const response = await call({
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

export default { key, init, computeMesh, computeSimulation }
