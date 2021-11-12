import { call, CallResponse } from '@/api/call'

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
): Promise<CallResponse> =>
  call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })
