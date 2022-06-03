/** @module Lib.Postprocessing */

import path from 'path'

import { SIMULATION } from '@/config/storage'

import Services from '@/services'

import Tools from '@/lib/tools'

const run = async (
  simulation: { id: string },
  result: { fileName: string; originPath: string },
  filter: string,
  parameters: string[]
): Promise<
  {
    fileName: string
    name: string
    originPath: string
    glb: string
  }[]
> => {
  // Result path
  const resultPath = path.join(SIMULATION, simulation.id, result.originPath)

  // Script
  const script = filter + '.py'
  await Tools.copyFile(
    { path: './postprocessing', file: script },
    { path: resultPath, file: script }
  )

  // In-out files
  const vtuIn = result.fileName
  const fileNameWithoutExtension = result.fileName
    .split('.')
    .slice(0, -1)
    .join('.')
  const vtuOut = fileNameWithoutExtension + '_' + filter + '.vtu'

  // pvpython
  const { code, data, error } = await Services.pvpython(
    resultPath,
    script,
    vtuIn,
    vtuOut,
    parameters
  )

  // Remove script
  await Tools.removeFile(path.join(resultPath, script))

  // Error
  if (code !== 0)
    throw new Error(
      'Post-processing script failed. Code ' +
        code +
        (data ? '\n' + data : '') +
        (error ? '\n' + error : '')
    )

  // Convert
  let convertData = ''
  let convertError = ''
  const target = fileNameWithoutExtension + '_' + filter
  const newResults = await Tools.convert(
    resultPath,
    { name: vtuOut, target },
    ({ data: cData, error: cError }) => {
      cData && (convertData += cData)
      cError && (convertError += cError)
    },
    { isResult: true }
  )

  if (convertError)
    throw new Error(
      'Error: Post-processing converting process failed (' + convertError + ')'
    )

  // New results
  return newResults.map((newResult) => ({
    fileName: vtuOut,
    name: newResult.name,
    originPath: result.originPath,
    glb: newResult.glb
  }))
}

const Postprocessing = { run }
export default Postprocessing
