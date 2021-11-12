import { call, CallResponse } from '@/api/call'

/**
 * Download
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @returns {Object} Geometry `{ buffer, extension }`
 */
export const download = async (geometry: {
  id: string
}): Promise<CallResponse> => call('/api/geometry/' + geometry.id + '/download')
