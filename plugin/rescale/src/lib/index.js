import path from 'path'
import FormData from 'form-data'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import Services from '@/services'

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

  // Create tasks
  const tasks = []
  const simulationTask = {
    type: 'simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  // Meshing
  // TODO, not needed for Denso
  await Promise.all(
    Object.keys(configuration).map(async (ckey) => {
      if (configuration[ckey].meshable) {
        configuration[ckey].mesh = {
          fileName: 'fileName',
          originPath: 'originPath',
          part: 'part',
          partPath: 'partPath'
        }
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
        path: '.'
      }
    },
    {
      location: path.join(simulationPath, 'run'),
      name: id + '.edp'
    }
  )

  // Upload files
  await uploadFile(cloudConfiguration, { id }, path.join('run', id + '.edp'))
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

  console.log(file)
}

export default { key, init, computeMesh, computeSimulation }
