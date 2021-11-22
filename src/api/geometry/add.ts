import { INewGeometry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Geometry
 * @param project Project
 * @param geometry Geometry
 * @returns Geometry
 */
export const add = async (
  project: { id: string },
  geometry: { name: string; uid: string; buffer: Buffer }
): Promise<INewGeometry> => {
  const response = await call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })

  return response.json()
}
