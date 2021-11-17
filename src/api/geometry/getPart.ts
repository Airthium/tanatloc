import { IGeometryPart } from '@/lib'

import { call } from '@/api/call'

/**
 * Get part
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @returns {Object} Part `{ uuid, buffer }`
 */
export const getPart = async (geometry: {
  id: string
}): Promise<IGeometryPart> => {
  const response = await call('/api/geometry/' + geometry.id + '/part')

  return response.json()
}
