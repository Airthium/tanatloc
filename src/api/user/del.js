import { call } from '../call'

/**
 * Delete an user
 * @memberof module:src/api/user
 */
const del = async () => {
  const res = await call('/api/user', {
    method: 'DELETE'
  })

  return res
}

export default del
