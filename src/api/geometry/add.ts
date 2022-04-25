/** @module API.Geometry.Add */

import { INewGeometryWithData } from '@/lib/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param project Project
 * @param geometry Geometry
 * @returns Geometry
 */
export const add = async (
  project: { id: string },
  geometry: { name: string; uid: string; buffer: Buffer }
): Promise<INewGeometryWithData> => {
  const response = await call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })

  return response.json()
}
