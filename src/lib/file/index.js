/** @module src/lib/file */

import path from 'path'

import storage from '@/config/storage'

import Tools from '../tools'

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

export default { get }
