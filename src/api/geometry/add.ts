/** @module API.Geometry.Add */

import { IFrontNewGeometry } from '../index.d'

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
): Promise<IFrontNewGeometry> => {
  const response = await call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })

  return response.json()
}
