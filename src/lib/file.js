import path from 'path'

import storage from '../../config/storage'

import { readFile } from './tools'

/**
 * Get file
 * @param {Object} data Data { simulation: { id }, file: { origin, originPath }}
 */
const get = async ({ simulation, file }) => {
  const content = await readFile(
    path.join(storage.SIMULATION, simulation.id, file.originPath, file.origin)
  )

  return {
    buffer: content
  }
}

export { get }
