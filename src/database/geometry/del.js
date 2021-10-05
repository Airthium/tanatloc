import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Geometry
 * @param {Object} geometry Geometry `{ id }`
 */
const del = async (geometry) => {
  await deleter(tables.GEOMETRIES, geometry.id)
}

export default del
