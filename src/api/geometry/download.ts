import { IGeometryFile } from '@/lib'

import { call } from '@/api/call'

/**
 * Download
 * @memberof API.Geometry
 * @param geometry Geometry
 * @returns Geometry
 */
export const download = async (geometry: {
  id: string
}): Promise<IGeometryFile> => {
  const response = await call('/api/geometry/' + geometry.id + '/download')

  return response.json()
}
