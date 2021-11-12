import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
const update = async (geometry, data) => {
  await updater(tables.GEOMETRIES, geometry.id, data)
}

export default update
