import { IGeometryPart } from '@/lib'

import { call } from '@/api/call'

/**
 * Get part
 * @memberof API.Geometry
 * @param geometry Geometry
 * @returns Part
 */
export const getPart = async (geometry: {
  id: string
}): Promise<IGeometryPart> => {
  const response = await call('/api/geometry/' + geometry.id + '/part')

  return response.json()
}
