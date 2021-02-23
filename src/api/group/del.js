import Caller from '@/api/call'

/**
 * Delete group
 * @memberof module:src/api/group
 * @param {Object} group Group
 */
const del = async (group) => {
  return Caller.call('/api/group', {
    method: 'DELETE',
    body: JSON.stringify(group)
  })
}

export default del
