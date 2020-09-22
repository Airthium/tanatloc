import { call } from '../call'

/**
 * Update user
 * @memberof module:src/api/user
 * @param {Array} data Data [{ key: value }, ...]
 */
const update = async (data) => {
  const res = await call('/api/user', {
    method: 'PUT',
    body: JSON.stringify({ data })
  })

  return res
}

export default update
