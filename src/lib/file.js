/** @module src/lib/file */

import path from 'path'
import fs from 'fs'

import storage from '@/config/storage'

import Tools from './tools'

/**
 * Get file
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { origin, originPath }
 */
const get = async (simulation, file) => {
  const content = await Tools.readFile(
    path.join(storage.SIMULATION, simulation.id, file.originPath, file.origin)
  )

  return {
    buffer: content
  }
}

const createStream = (simulation, file) => {
  const fileStream = fs.createReadStream(
    path.join(storage.SIMULATION, simulation.id, file.originPath, file.fileName)
  )
  return fileStream
}

export default { get, createStream }
