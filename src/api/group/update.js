import Caller from '@/api/call'

/**
 * Update group
 * @memberof module:src/api/group
 * @param {Object} group Group { id }
 * @param {Array} Data
 */
const update = async (id, data) => {
  return Caller.call('/api/group', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default update
