import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Geometry
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
