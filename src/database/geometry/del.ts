/** @module Database.Geometry.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param geometry Geometry
 */
export const del = async (geometry: { id: string }): Promise<void> => {
  await deleter(tables.GEOMETRIES, geometry.id)
}
