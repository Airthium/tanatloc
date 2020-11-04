import { call } from '../call'

/**
 * Delete an user
 * @memberof module:src/api/user
 */
const del = async () => {
  return call('/api/user', {
    method: 'DELETE'
  })
}

export default del
