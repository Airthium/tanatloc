import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
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
