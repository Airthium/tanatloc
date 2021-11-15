/** @namespace Lib.Result */

import path from 'path'
import archiver from 'archiver'
import { ReadStream } from 'fs'

import { SIMULATION } from '@/config/storage'

import Simulation from '../simulation'
import Tools from '../tools'

import createSummary from './createSummary'
import createPVD from './createPVD'

const archiveFileName = 'resultsArchive.zip'

/**
 * Load
 * @memberof Lib.Result
 * @param {Object} simulation Simulation `{ id }`
 * @param {Object} result Result `{ originPath, glb } }`
 * @returns {Object} Result `{ buffer }`
 */
const load = async (
  simulation: { id: string },
  result: { originPath: string; glb: string }
): Promise<{ buffer: Buffer }> => {
  const buffer = await Tools.readFile(
    path.join(SIMULATION, simulation.id, result.originPath, result.glb)
  )

  return {
    buffer: Buffer.from(buffer)
  }
}

/**
 * Download
 * @memberof Lib.Result
 * @param {Object} simulation Simulation `{ id }`
 * @param {Object} result Result `{ originPath, fileName } }`
 * @return {Object} Read stream
 */
const download = (
  simulation: { id: string },
  result: { originPath: string; fileName: string }
): ReadStream => {
  return Tools.readStream(
    path.join(SIMULATION, simulation.id, result.originPath, result.fileName)
  )
}

/**
 * Archive
 * @memberof Lib.Result
 * @param {Object} simulation Simulation `{ id } }`
 * @returns {Object} Read stream
 */
const archive = async (simulation: { id: string }): Promise<ReadStream> => {
  const resultPath = path.join(SIMULATION, simulation.id, 'run', 'result')

  const archiveName = path.join(
    SIMULATION,
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
  const output = Tools.writeStream(archiveName)
  const zip = archiver('zip')

  await new Promise(async (resolve, reject) => {
    zip.on('warning', (err: Error) => console.warn(err))
    zip.on('error', (err: Error) => reject(err))
    zip.pipe(output)

    // Append files
    await Promise.all(
      files.map(async (file) => {
        const extension = file.split('.').pop()
        if (extension === 'vtu')
          await zip.append(Tools.readStream(path.join(resultPath, file)), {
            name: path.join('result', file)
          })
      })
    )

    await zip.append(Tools.readStream(summary.path), { name: summary.name })

    await Promise.all(
      pvdFiles.map(async (file) => {
        await zip.append(Tools.readStream(file.path), { name: file.name })
      })
    )

    output.on('close', resolve)
    // Finalize
    await zip.finalize()
  })

  // Read stream
  return Tools.readStream(
    path.join(SIMULATION, simulation.id, 'run', archiveFileName)
  )
}

const Result = { load, archive, download }
export default Result
