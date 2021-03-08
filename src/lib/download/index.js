/** @module src/lib/download */

import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

import storage from '@/config/storage'

import Simulation from '@/lib/simulation'
import Tools from '@/lib/tools'

import createSummary from './summary'
import createPVD from './pvd'

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

  // Get result files
  const filesDirents = await Tools.listFiles(resultPath)
  const files = filesDirents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)

  // Summary
  const simulationScheme = await Simulation.get(simulation.id, [
    'name',
    'scheme'
  ])
  const summary = createSummary(simulationScheme)

  // PVD files
  const pvdFiles = createPVD(simulationScheme, files)

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
    archive.append(fs.createReadStream(summary.path), { name: summary.name })
    pvdFiles.forEach((file) => {
      archive.append(fs.createReadStream(file.path), { name: file.name })
    })

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
