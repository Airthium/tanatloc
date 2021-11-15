import { call } from '@/api/call'

/**
 * Delete group
 * @memberof API.Group
 * @param {Object} group Group `{ id }`
 */
const del = async (group) => {
  await call('/api/group', {
    method: 'DELETE',
    body: JSON.stringify(group)
  })
}

export default del
