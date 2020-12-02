import Caller from '../call'

/**
 * Delete an user
 * @memberof module:src/api/user
 */
const del = async () => {
  return Caller.call('/api/user', {
    method: 'DELETE'
  })
}

export default del
