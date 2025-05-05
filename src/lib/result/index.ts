/** @module Lib.Result */

import path from 'path'
import archiver from 'archiver'
import { ReadStream } from 'fs'
import extractJson from '@airthium/extract-json-from-string'

import { SIMULATION } from '@/config/storage'

import { IGeometryPart } from '@/lib/index.d'

import Simulation from '@/lib/simulation'
import Tools from '@/lib/tools'

import createSummary from './createSummary'
import createPVD from './createPVD'

const archiveFileName = 'resultsArchive.zip'

/**
 * Load
 * @param simulation Simulation
 * @param result Result
 * @returns New result
 */
const load = async (
  simulation: { id: string },
  result: { originPath: string; glb: string }
): Promise<IGeometryPart> => {
  // Read GLB
  const buffer = await Tools.readFile(
    path.join(SIMULATION, simulation.id, result.originPath, result.glb)
  )

  // Read summary
  let toExtract = buffer.toString()
  const pos = toExtract.indexOf('JSON{')
  toExtract = toExtract.slice(pos + 4)

  const jsons = extractJson(toExtract)
  const summary = jsons[0].scenes[0].extras

  return {
    summary,
    buffer: Buffer.from(buffer)
  }
}

/**
 * Download
 * @param simulation Simulation
 * @param result Result
 * @return Read stream
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
 * @param simulation Simulation
 * @returns Read stream
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
  const simulationData = await Simulation.get(simulation.id, ['name', 'scheme'])
  if (!simulationData) throw new Error('Simulation not found')

  const summary = createSummary(simulationData)

  // PVD files
  const pvdFiles = createPVD(simulationData, files)

  // Create zip
  const output = Tools.writeStream(archiveName)
  const zip = archiver('zip')

  await new Promise((resolve, reject) => {
    zip.on('warning', (err: Error) => console.warn(err))
    zip.on('error', (err: Error) => reject(err))
    zip.pipe(output)

    // Append files
    files.forEach((file) => {
      const extension = file.split('.').pop()
      if (extension === 'vtu')
        zip.append(Tools.readStream(path.join(resultPath, file)), {
          name: path.join('result', file)
        })
    })

    zip.append(Tools.readStream(summary.path), { name: summary.name })

    pvdFiles.forEach((file) => {
      zip.append(Tools.readStream(file.path), { name: file.name })
    })

    output.on('close', resolve as any)

    // Finalize
    zip.finalize().catch(console.error)
  })

  // Read stream
  return Tools.readStream(
    path.join(SIMULATION, simulation.id, 'run', archiveFileName)
  )
}

const Result = { load, archive, download }
export default Result
