import path from 'path'
import FormData from 'form-data'

import SimulationDB from '@/database/simulation'

import Tools from '@/lib/tools'
import Sentry from '@/lib/sentry'

import Services from '@/services'

import call from './call'

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

  return analyses.results.find((analysis) => analysis.code === 'freefem')
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
 * Upload file
 * @param {Object} configuration Configuration
 * @param {string} fileName File name
 */
const uploadFile = async (configuration, fileName) => {
  const fileContent = await Tools.readFile(fileName)

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
 * Upload files
 * @param {Object} configuration Configuration
 * @param {Array} files Files { name, path }
 * @param {Object?} task Task
 */
const uploadFiles = async (configuration, files, task) => {
  return Promise.all(
    files.map(async (file) => {
      if (task) task.log += ' - ' + file.name + '\n'
      return uploadFile(configuration, file.path)
    })
  )
}

/**
 * Create job
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 * @param {Object} parameters Parameters
 * @param {string} command Command
 * @param {Array} geometries Geometries
 * @param {Array} meshes Meshes
 * @param {Object} edp Edp
 */
const createJob = async (
  algorithm,
  configuration,
  parameters,
  command,
  geometries,
  meshes,
  edp
) => {
  const name = 'Tanatloc - ' + algorithm
  const coreType = parameters.coreTypes.value
  const lowPriority = parameters.lowPriority.value
  const numberOfCores = parameters.numberOfCores.value
  const freefemVersion = parameters.freefemVersion.value

  const additionalFiles = configuration.additionalFiles.value || ''

  const inputFiles = [
    ...geometries.map((g) => ({ id: g.id })),
    ...meshes.map((m) => ({ id: m.id })),
    { id: edp.id }
  ]

  additionalFiles &&
    inputFiles.push(...additionalFiles.split(',').map((f) => ({ id: f })))

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
          command: command,
          inputFiles: inputFiles
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
      Sentry.captureException(err)
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

  if (!status.results) {
    console.log(status)
    return 'Completed'
  }

  // Last status
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
  return call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route
  })
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
  return call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'files/' + id + '/contents/'
  })
}

/**
 * Get in-run outputs
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} warnings Warnings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} dataPath Data path
 * @param {Object} task Task
 */
const getInRunOutputs = async (
  configuration,
  log,
  availableFiles,
  existingResults,
  existingDatas,
  warnings,
  simulationPath,
  resultPath,
  dataPath,
  task
) => {
  return processOutput(
    'inrun',
    configuration,
    log,
    availableFiles,
    existingResults,
    existingDatas,
    warnings,
    simulationPath,
    resultPath,
    dataPath,
    task
  )
}

/**
 * Get outputs
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} warnings Warnings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} dataPath Data path
 * @param {Object} task Task
 */
const getOutputs = async (
  configuration,
  log,
  availableFiles,
  existingResults,
  existingDatas,
  warnings,
  simulationPath,
  resultPath,
  dataPath,
  task
) => {
  return processOutput(
    'final',
    configuration,
    log,
    availableFiles,
    existingResults,
    existingDatas,
    warnings,
    simulationPath,
    resultPath,
    dataPath,
    task
  )
}

/**
 * Process output
 * @param {string} type Type
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} warnings Warnings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} dataPath Data path
 * @param {Object} task Task
 */
const processOutput = async (
  type,
  configuration,
  log,
  availableFiles,
  existingResults,
  existingDatas,
  warnings,
  simulationPath,
  resultPath,
  dataPath,
  task
) => {
  if (log.includes('PROCESS VTU FILE') || log.includes('PROCESS DATA FILE')) {
    const lines = log.split('\n')
    const resultLines = lines.filter((l) => l.includes('PROCESS VTU FILE'))
    const dataLines = lines.filter((l) => l.includes('PROCESS DATA FILE'))

    const nonResultLines = lines.filter(
      (l) => !l.includes('PROCESS VTU FILE') && !l.includes('PROCESS DATA FILE')
    )
    const realLog = nonResultLines.join('\n')

    // Get result
    await Promise.all(
      resultLines.map(async (line) => {
        // New result
        const resultFile = line
          .replace('PROCESS VTU FILE', '')
          .replace(/\[.*\]: /g, '')
          .trim()

        await processResult(
          type,
          resultFile,
          configuration,
          availableFiles,
          existingResults,
          warnings,
          simulationPath,
          resultPath,
          task
        )
      })
    )

    // Get data
    await Promise.all(
      dataLines.map(async (line) => {
        // New data
        const dataFile = line
          .replace('PROCESS DATA FILE', '')
          .replace(/\[.*\]: /g, '')
          .trim()

        await processData(
          type,
          dataFile,
          configuration,
          availableFiles,
          existingDatas,
          warnings,
          simulationPath,
          dataPath,
          task
        )
      })
    )

    // Return real log
    return realLog
  } else {
    // This is just some log
    return log
  }
}

/**
 * Process result
 * @param {string} Type
 * @param {string} resultFile Result file
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Arrays} warnings Warnings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {Object} task Task
 */
const processResult = async (
  type,
  resultFile,
  configuration,
  availableFiles,
  existingResults,
  warnings,
  simulationPath,
  resultPath,
  task
) => {
  // Part path
  const partPath = resultFile.replace('.vtu', '')

  // Check already existing
  const existing = existingResults.includes(resultFile)
  if (existing) return

  try {
    // Get file
    let file
    if (type === 'inrun') {
      file = availableFiles.find((f) => f.path.includes(resultFile))
    } else {
      file = availableFiles.find((f) => f.relativePath.includes(resultFile))
    }

    if (!file) throw new Error('No available file')

    // Get file content
    let fileContent
    if (type === 'inrun') {
      fileContent = await getInRunFile(configuration, file)
      if (fileContent.detail)
        throw new Error('Run is not active. Trying to get the file at the end')
      if (typeof fileContent !== 'string')
        throw new Error('Rescale empty response')
    } else {
      fileContent = await getFile(configuration, file.id)
    }

    // Write file
    await Tools.writeFile(
      path.join(simulationPath, resultPath),
      resultFile,
      fileContent
    )

    // Convert file
    const three = await Services.toThree(
      simulationPath,
      path.join(resultPath, resultFile),
      path.join(resultPath, partPath)
    )
    if (three.code !== 0) {
      console.warn(
        'Warning: Result converting process failed. Code ' + three.code
      )
      warnings.push(
        'Warning: Result converting process failed. Code ' + three.code
      )
    } else if (three.error) {
      console.warn(
        'Warning: Result converting process failed (' + three.error + ')'
      )
      warnings.push(
        'Warning: Result converting process failed (' + three.error + ')'
      )
    } else {
      const results = three.data
        ?.trim()
        ?.split('\n')
        .map((res) => JSON.parse(res))

      // Update task
      task.files = [
        ...(task.files || []),
        ...results.map((result) => ({
          fileName: resultFile,
          originPath: resultPath,
          name: result.name,
          part: 'part.json',
          partPath: result.path
        }))
      ]

      // Update existing results
      existingResults.push(resultFile)
    }
  } catch (err) {
    console.warn('Warning: Unable to convert result file (' + err.message + ')')
    warnings.push(
      'Warning: Unable to convert result file (' + err.message + ')'
    )
  }
}

/**
 * Process data
 * @param {string} type Type
 * @param {*} dataFile Data file
 * @param {*} configuration Configuration
 * @param {*} availableFiles Available files
 * @param {*} existingDatas Existing datas
 * @param {*} warnings Warnings
 * @param {*} simulationPath Simulation path
 * @param {*} dataPath Data path
 * @param {*} task Task
 */
const processData = async (
  type,
  dataFile,
  configuration,
  availableFiles,
  existingDatas,
  warnings,
  simulationPath,
  dataPath,
  task
) => {
  // Check already existing
  const existing = existingDatas.includes(dataFile)
  if (existing) return

  try {
    // Get file
    let file
    if (type === 'inrun') {
      file = availableFiles.find((f) => f.path.includes(dataFile))
    } else {
      file = availableFiles.find((f) => f.relativePath.includes(dataFile))
    }
    if (!file) throw new Error('No available file')

    // Get content
    let fileContent
    if (type === 'inrun') {
      fileContent = await getInRunFile(configuration, file)
      if (fileContent.detail)
        throw new Error('Run is not active. Trying to get the file at the end')
      if (typeof fileContent !== 'string')
        throw new Error('Rescale empty response')
    } else {
      fileContent = await getFile(configuration, file.id)
    }

    // Write file
    await Tools.writeFile(
      path.join(simulationPath, dataPath),
      dataFile,
      fileContent
    )

    // Update task
    task.datas = [...(task.datas || []), JSON.parse(fileContent.toString())]

    // Update existing datas
    existingDatas.push(dataFile)
  } catch (err) {
    console.warn('Warning: Unable to read data file (' + err.message + ')')
    warnings.push('Warning: Unable to read data file (' + err.message + ')')
  }
}

export {
  getFreeFEM,
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
}
