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
        const partPath = resultFile.replace('.vtu', '')

        // Check already existing
        const existing = existingResults.includes(resultFile)
        if (existing) return

        try {
          // Get file
          const file = availableFiles.find((f) => f.path.includes(resultFile))
          if (!file) return

          const fileContent = await getInRunFile(configuration, file)

          // Write file
          await Tools.writeFile(
            path.join(simulationPath, resultPath),
            resultFile,
            fileContent
          )

          // Convert file
          const results = []
          const resCode = await Services.toThree(
            simulationPath,
            path.join(resultPath, resultFile),
            path.join(resultPath, partPath),
            ({ error: resError, data: resData }) => {
              if (resError) {
                warnings.push('Warning: ' + resError)
              }
              if (resData) {
                try {
                  const jsonData = JSON.parse(resData)
                  results.push(jsonData)
                } catch (jsonErr) {
                  warnings.push('Warning: ' + jsonErr.message)
                }
              }
            }
          )
          if (resCode !== 0) {
            warnings.push(
              'Warning: Result converting process failed. Code ' + resCode
            )
          } else {
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
          }

          // Update existing results
          existingResults.push(resultFile)
        } catch (err) {
          warnings.push(
            'Warning: Unable to convert result file (' + err.message + ')'
          )
        }
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

        // Check already existing
        const existing = existingDatas.includes(dataFile)
        if (existing) return

        try {
          // Get file
          const file = availableFiles.find((f) => f.path.includes(dataFile))
          if (!file) return

          const fileContent = await getInRunFile(configuration, file)

          // Write file
          await Tools.writeFile(
            path.join(simulationPath, dataPath),
            dataFile,
            fileContent
          )

          task.datas = [
            ...(task.datas || []),
            JSON.parse(fileContent.toString())
          ]

          existingDatas.push(dataFile)
        } catch (err) {
          warnings.push(
            'Warning: Unable to read data file (' + err.message + ')'
          )
        }
      })
    )

    // Return real log
    return realLog
  } else {
    // This is just some log
    return log
  }
}

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
        const partPath = resultFile.replace('.vtu', '')

        // Check already existing
        const existing = existingResults.includes(resultFile)
        if (existing) return

        try {
          // Get file
          const file = availableFiles.find((f) =>
            f.relativePath.includes(resultFile)
          )
          if (!file) return

          const fileContent = await getFile(configuration, file)

          // Write file
          await Tools.writeFile(
            path.join(simulationPath, resultPath),
            resultFile,
            fileContent
          )

          // Convert file
          const results = []
          const resCode = await Services.toThree(
            simulationPath,
            path.join(resultPath, resultFile),
            path.join(resultPath, partPath),
            ({ error: resError, data: resData }) => {
              if (resError) {
                warnings.push('Warning: ' + resError)
              }
              if (resData) {
                try {
                  const jsonData = JSON.parse(resData)
                  results.push(jsonData)
                } catch (jsonErr) {
                  warnings.push('Warning: ' + jsonErr.message)
                }
              }
            }
          )
          if (resCode !== 0) {
            warnings.push(
              'Warning: Result converting process failed. Code ' + resCode
            )
          } else {
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
          }

          // Update existing results
          existingResults.push(resultFile)
        } catch (err) {
          warnings.push(
            'Warning: Unable to convert result file (' + err.message + ')'
          )
        }
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

        // Check already existing
        const existing = existingDatas.includes(dataFile)
        if (existing) return

        try {
          // Get file
          const file = availableFiles.find((f) =>
            f.relativePath.includes(dataFile)
          )
          if (!file) return

          const fileContent = await getInRunFile(configuration, file)

          // Write file
          await Tools.writeFile(
            path.join(simulationPath, dataPath),
            dataFile,
            fileContent
          )

          task.datas = [
            ...(task.datas || []),
            JSON.parse(fileContent.toString())
          ]

          existingDatas.push(dataFile)
        } catch (err) {
          warnings.push(
            'Warning: Unable to read data file (' + err.message + ')'
          )
        }
      })
    )

    // Return real log
    return realLog
  } else {
    // This is just some log
    return log
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
