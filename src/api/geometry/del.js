import Caller from '@/api/call'

/**
 * Delete geometry
 * @memberof module:api/geometry
 * @param {Object} geometry Geometry { id }
 */
const del = async (geometry) => {
  return Caller.call('/api/geometry/' + geometry.id, {
    method: 'DELETE'
  })
}

export default del
