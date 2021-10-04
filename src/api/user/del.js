import Caller from '@/api/call'

/**
 * Delete
 * @memberof API.User
 */
const del = async () => {
  await Caller.call('/api/user', {
    method: 'DELETE'
  })
}

export default del
