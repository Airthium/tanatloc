import { INewGeometry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Geometry
 * @param {Object} project Project `{ id }`
 * @param {Object} geometry Geometry `{ name, uid, buffer }`
 * @returns {Object} Geometry `{ id, name, originalfilename, extension, uploadfilename, json, glb, summary }`
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
