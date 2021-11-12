import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  geometry: { id: string },
  data: Array<DataBaseEntry>
) => {
  await updater(tables.GEOMETRIES, geometry.id, data)
}
