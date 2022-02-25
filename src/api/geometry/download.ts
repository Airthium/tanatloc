/** @module API.Geometry.Download */

import { IGeometryFile } from '@/lib/index.d'

import { call } from '@/api/call'

/**
 * Download
 * @param geometry Geometry
 * @returns Geometry
 */
export const download = async (geometry: {
  id: string
}): Promise<IGeometryFile> => {
  const response = await call('/api/geometry/' + geometry.id + '/download')

  return response.json()
}
