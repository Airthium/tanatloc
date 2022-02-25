/** @module API.Geometry.Update */

import { call } from '@/api/call'

/**
 * Update
 * @param geometry Geometry
 * @param data Data
 */
export const update = async (
  geometry: { id: string },
  data: Array<any>
): Promise<void> => {
  await call('/api/geometry/' + geometry.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
