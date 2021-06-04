import Caller from '@/api/call'

/**
 * Download geometry
 * @memberof module:api/geometry
 * @param {Object} geometry Geometry { id }
 */
const download = async (geometry) => {
  return Caller.call('/api/geometry/' + geometry.id + '/download')
}

export default download
