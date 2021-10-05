import Caller from '@/api/call'

/**
 * Download
 * @memberof API.Geometry
 * @param {Object} geometry Geometry `{ id }`
 * @returns {Object} Geometry `{ buffer, extension }`
 */
const download = async (geometry) => {
  return Caller.call('/api/geometry/' + geometry.id + '/download')
}

export default download
