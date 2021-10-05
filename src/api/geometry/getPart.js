import Caller from '@/api/call'

/**
 * Get part
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @returns {Object} Part `{ uuid, buffer }`
 */
const getPart = async (geometry) => {
  return Caller.call('/api/geometry/' + geometry.id + '/part')
}

export default getPart
