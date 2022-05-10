import path from 'path'
import { spawn } from 'child_process'

import { SIMULATION } from '@/config/storage'

import PostprocessingList from 'postprocessing'

const list = () => PostprocessingList

const run = async (
  simulation: { id: string },
  result: { fileName: string; originPath: string },
  filter: string,
  parameters: string[]
) => {
  const fileNameWithoutExtension = result.fileName
    .split('.')
    .slice(0, -1)
    .join('.')
  const vtu = path.join(
    SIMULATION,
    simulation.id,
    result.originPath,
    fileNameWithoutExtension + '.vtu'
  )
  const outVtu = path.join(
    SIMULATION,
    simulation.id,
    result.originPath,
    fileNameWithoutExtension + '_' + filter + '.vtu'
  )

  const python = spawn('pvpython', [
    './postprocessing/warpByVector.py',
    vtu,
    outVtu,
    ...parameters
  ])

  python.stdout.on('data', (data: Buffer) => {
    console.log(data.toString())
  })

  python.stderr.on('data', (data: Buffer) => {
    console.log(data.toString())
  })

  python.on('close', (code: number) => {
    console.log(code)
  })

  python.on('error', (err: Error) => {
    console.log(err)
  })

  return {}
}

const Postprocessing = { list, run }
export default Postprocessing
