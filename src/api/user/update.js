import Caller from '@/api/call'

/**
 * Update
 * @memberof API.User
 * @param {Array} data Data `[{ key, value }, ...]`
 */
const update = async (data) => {
  await Caller.call('/api/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
