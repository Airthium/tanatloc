/** @module Database.Geometry.Get */

import { IGeometry } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id Id
 * @param data Data
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
