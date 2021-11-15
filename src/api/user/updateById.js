import { call } from '@/api/call'

/**
 * Update by id
 * @memberof API.User
 * @param {string} id User id
 * @param {Array} data Data `[{ key: value }, ...]`
 */
const updateById = async (id, data) => {
  await call('/api/user/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default updateById
