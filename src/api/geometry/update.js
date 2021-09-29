import Caller from '@/api/call'

/**
 * Update
 * @memberof API.Geometry
 * @param {Object} geometry Geometry { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (geometry, data) => {
  await Caller.call('/api/geometry/' + geometry.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
