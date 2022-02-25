/** @module API.Geometry.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param geometry Geometry
 */
export const del = async (geometry: { id: string }): Promise<void> => {
  await call('/api/geometry/' + geometry.id, {
    method: 'DELETE'
  })
}
