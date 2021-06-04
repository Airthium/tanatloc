import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update geometry
 * @memberof module:database/geometry
 * @param {Object} geometry Geometry { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (geometry, data) => {
  return updater(tables.GEOMETRIES, geometry.id, data)
}

export default update
