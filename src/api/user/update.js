import { call } from '@/api/call'

/**
 * Update
 * @memberof API.User
 * @param {Array} data Data `[{ key, value }, ...]`
 */
const update = async (data) => {
  await call('/api/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
