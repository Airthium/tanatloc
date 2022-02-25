/** @module Database.Geometry.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param geometry Geometry
 * @param data Data
 */
export const update = async (
  geometry: { id: string },
  data: Array<IDataBaseEntry>
) => {
  await updater(tables.GEOMETRIES, geometry.id, data)
}
