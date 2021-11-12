import { call, CallResponse } from '@/api/call'

/**
 * Get part
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @returns {Object} Part `{ uuid, buffer }`
 */
export const getPart = async (geometry: {
  id: string
}): Promise<CallResponse> => call('/api/geometry/' + geometry.id + '/part')
