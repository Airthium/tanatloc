import Caller from '@/api/call'

/**
 * Update geometry
 * @memberof module:api/geometry
 * @param {Object} geometry Geometry { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (geometry, data) => {
  return Caller.call('/api/geometry/' + geometry.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
