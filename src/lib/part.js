import path from 'path'

import storage from '../../config/storage'

import Tools from './tools'

/**
 * Get part
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { part, partPath }
 */
const get = async (simulation, file) => {
  const part = await Tools.loadPart(
    path.join(storage.SIMULATION, simulation.id, file.partPath),
    file.part
  )

  return part
}

export default { get }
