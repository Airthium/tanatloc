import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get geometry by id
 * @memberof module:database/geometry
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(tables.GEOMETRIES, id, data)

  const geometry = response.rows[0]
  geometry.id = id

  return geometry
}

export default get
