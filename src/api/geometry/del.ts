import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Geometry
 * @param geometry Geometry
 */
export const del = async (geometry: { id: string }): Promise<void> => {
  await call('/api/geometry/' + geometry.id, {
    method: 'DELETE'
  })
}
