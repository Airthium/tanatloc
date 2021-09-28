/** @module lib/result */

import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

import storage from '@/config/storage'

import Simulation from '../simulation'
import Tools from '../tools'

import createSummary from './createSummary'
import createPVD from './createPVD'

const archiveFileName = 'resultsArchive.zip'

/**
 * Load
 * @param {Object} simulation Simulation { id }
 * @param {Object} result Result { originPath, glb } }
 */
const load = async (simulation, result) => {
  const buffer = await Tools.readFile(
    path.join(storage.SIMULATION, simulation.id, result.originPath, result.glb)
  )

  return {
    buffer: Buffer.from(buffer)
  }
}

/**
 * Download
 * @param {Object} simulation Simulation { id }
 * @param {Object} result Result { originPath, fileName } }
 */
const download = (simulation, result) => {
  return fs.createReadStream(
    path.join(
      storage.SIMULATION,
      simulation.id,
      result.originPath,
      result.fileName
    )
  )
}

/**
 * Archive
 * @param {Object} simulation Simulation { id } }
 */
const archive = async (simulation) => {
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
    archiveFileName
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
  const zip = archiver('zip')

  await new Promise(async (resolve, reject) => {
    zip.on('warning', (err) => console.warn(err))
    zip.on('error', (err) => reject(err))
    zip.pipe(output)

    // Append files
    await Promise.all(
      files.map(async (file) => {
        const extension = file.split('.').pop()
        if (extension === 'vtu')
          await zip.append(fs.createReadStream(path.join(resultPath, file)), {
            name: path.join('result', file)
          })
      })
    )

    await zip.append(fs.createReadStream(summary.path), { name: summary.name })

    await Promise.all(
      pvdFiles.map(async (file) => {
        await zip.append(fs.createReadStream(file.path), { name: file.name })
      })
    )

    output.on('close', resolve)
    // Finalize
    await zip.finalize()
  })

  // Read stream
  return fs.createReadStream(
    path.join(storage.SIMULATION, simulation.id, 'run', archiveFileName)
  )
}

const Result = { load, archive, download }
export default Result
