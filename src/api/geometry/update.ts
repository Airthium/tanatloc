/** @module API.Geometry.Update */

import { call } from '@/api/call'

import { IDataBaseEntry } from '@/database/index.d'

/**
 * Update
 * @param geometry Geometry
 * @param data Data
 */
export const update = async (
  geometry: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/geometry/' + geometry.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
