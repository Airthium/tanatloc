/** @module src/lib/download */

import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

import storage from '@/config/storage'

import Simulation from '@/lib/simulation'
import Tools from '@/lib/tools'

/**
 * Create archive stream
 * @param {Object} simulation Simulation
 */
const createArchiveStream = async (simulation) => {
  const resultPath = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    'result'
  )
  const archiveName = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    'archive.zip'
  )

  const summaryName = path.join(
    storage.SIMULATION,
    simulation.id,
    'run',
    'summary.txt'
  )

  // Get result files
  const filesDirents = await Tools.listFiles(resultPath)
  const files = filesDirents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

  // Simulation summary
  const simulationScheme = await Simulation.get(simulation.id, ['scheme'])
  const summary = fs.createWriteStream(summaryName)
  Object.keys(simulationScheme.scheme.configuration).forEach((key) => {
    const config = simulationScheme.scheme.configuration[key]
    if (key === 'part') return
    if (key === 'geometry')
      summary.write('Geometry: ' + config.file.name + '\n')
    if (key === 'parameters') {
      summary.write('Parameters:\n')
      Object.keys(config).forEach((subKey) => {
        if (subKey === 'index' || subKey === 'title' || subKey === 'done')
          return
        else {
          summary.write('- ' + config[subKey].label + '\n')
          config[subKey].children.forEach((child) => {
            summary.write(
              '  - ' +
                child.label +
                ': ' +
                (child.value || child.default) +
                '\n'
            )
          })
        }
      })
    }
  })
  summary.end()

  // Create zip
  const output = fs.createWriteStream(archiveName)
  const archive = archiver('zip')

  await new Promise(async (resolve, reject) => {
    archive.on('warning', (err) => console.warn(err))
    archive.on('error', (err) => reject(err))
    archive.pipe(output)

    // Append files
    files.forEach((file) => {
      archive.append(fs.createReadStream(path.join(resultPath, file)), {
        name: path.join('result', file)
      })
    })
    archive.append(fs.createReadStream(summaryName), { name: 'summary.txt' })

    output.on('close', resolve)

    // Finalize
    await archive.finalize()
  })

  // Read stream
  return createReadStream(simulation, {
    originPath: 'run',
    fileName: 'archive.zip'
  })
}

/**
 * Create read stream
 * @param {Object} simulation Simulation
 * @param {Object} file File
 */
const createReadStream = (simulation, file) => {
  return fs.createReadStream(
    path.join(storage.SIMULATION, simulation.id, file.originPath, file.fileName)
  )
}

export default { createArchiveStream, createReadStream }
