import Caller from '@/api/call'

/**
 * Get geometry part
 * @memberof module:api/geometry
 * @param {Object} geometry Geometry { id }
 */
const getPart = async (geometry) => {
  return Caller.call('/api/geometry/' + geometry.id + '/part')
}

export default getPart
