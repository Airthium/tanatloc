import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.User
 */
const del = async () => {
  await call('/api/user', {
    method: 'DELETE'
  })
}

export default del
