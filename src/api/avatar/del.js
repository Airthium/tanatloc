import Caller from '@/api/call'

/**
 * Delete
 * @memberof module:api/avatar
 * @param {Object} avatar Avatar { id }
 */
const del = async (avatar) => {
  return Caller.call('/api/avatar', {
    method: 'DELETE',
    body: JSON.stringify(avatar)
  })
}
export default del
