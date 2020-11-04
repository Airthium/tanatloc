import { call } from '../call'

/**
 * Update user
 * @memberof module:src/api/user
 * @param {Array} data Data [{ key: value }, ...]
 */
const update = async (data) => {
  return call('/api/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
