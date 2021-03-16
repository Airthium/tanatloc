import Caller from '@/api/call'

/**
 * Update user by id
 * @memberof module:api/user
 * @param {string} id User id
 * @param {Array} data Data [{ key: value }, ...]
 */
const updateById = async (id, data) => {
  return Caller.call('/api/user/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default updateById
