/** @module API.Geometry.GetPart */

import { IGeometryPart } from '@/lib/index.d'

import { call } from '@/api/call'

/**
 * Get part
 * @param geometry Geometry
 * @returns Part
 */
export const getPart = async (geometry: {
  id: string
}): Promise<IGeometryPart> => {
  const response = await call('/api/geometry/' + geometry.id + '/part')

  return response.json()
}
