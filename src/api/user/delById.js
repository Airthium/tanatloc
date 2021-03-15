import Caller from '@/api/call'

/**
 * Delete user by id
 * @memberof module:api/user
 */
const delById = async (id) => {
  return Caller.call('/api/user/' + id, {
    method: 'DELETE'
  })
}

export default delById
