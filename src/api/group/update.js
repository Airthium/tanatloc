import Caller from '@/api/call'

/**
 * Update group
 * @memberof module:api/group
 * @param {Object} group Group { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (id, data) => {
  return Caller.call('/api/group', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default update
