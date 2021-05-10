/** @module lib/part */

import path from 'path'

import storage from '@/config/storage'

import Tools from '../tools'

/**
 * Get part
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { part, partPath }
 */
const get = async (simulation, file) => {
  if (file.glb) {
    const glb = await Tools.readFile(
      path.join(storage.SIMULATION, simulation.id, file.glb)
    )
    return {
      buffer: glb
    }
  } else {
    return Tools.loadPart(
      path.join(storage.SIMULATION, simulation.id, file.partPath),
      file.part
    )
  }
}

export default { get }
