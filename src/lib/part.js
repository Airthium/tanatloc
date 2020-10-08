import path from 'path'

import storage from '../../config/storage'

import { loadPart } from './tools'

/**
 * Get part
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { part, partPath }
 */
const get = async (simulation, file) => {
  const part = await loadPart(
    path.join(storage.SIMULATION, simulation.id, file.partPath),
    file.part
  )

  return part
}

export { get }
