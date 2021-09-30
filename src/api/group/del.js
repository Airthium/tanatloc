import Caller from '@/api/call'

/**
 * Delete group
 * @memberof API.Group
 * @param {Object} group Group
 */
const del = async (group) => {
  await Caller.call('/api/group', {
    method: 'DELETE',
    body: JSON.stringify(group)
  })
}

export default del
