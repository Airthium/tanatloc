import Caller from '@/api/call'

/**
 * Delete an user
 * @memberof module:api/user
 */
const del = async () => {
  return Caller.call('/api/user', {
    method: 'DELETE'
  })
}

export default del
