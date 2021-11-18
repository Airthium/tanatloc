import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Geometry
 * @param geometry Geometry
 */
export const del = async (geometry: { id: string }): Promise<void> => {
  await deleter(tables.GEOMETRIES, geometry.id)
}
