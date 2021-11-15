import { tables } from '@/config/db'

import { getter } from '..'
import { IGeometry } from '../index.d'

/**
 * Get
 * @memberof Database.Geometry
 * @param {string} id Id
 * @param {Array} data Data
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<IGeometry> => {
  const response = await getter(tables.GEOMETRIES, id, data)

  const geometry = response.rows[0]
  geometry && (geometry.id = id)

  return geometry
}
