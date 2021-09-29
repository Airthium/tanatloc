import Caller from '@/api/call'

/**
 * Delete
 * @memberof API.Geometry
 * @param {Object} geometry Geometry { id }
 */
const del = async (geometry) => {
  await Caller.call('/api/geometry/' + geometry.id, {
    method: 'DELETE'
  })
}

export default del
