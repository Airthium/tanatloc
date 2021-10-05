import Caller from '@/api/call'

/**
 * Update group
 * @memberof API.Group
 * @param {Object} group Group `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
const update = async (id, data) => {
  await Caller.call('/api/group', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default update
