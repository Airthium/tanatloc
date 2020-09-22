import { call } from '../call'

/**
 * Check an user
 * @memberof module:src/api/user
 * @param {Object} data Data { username, password }
 */
const check = async ({ username, password }) => {
  const res = await call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  return res
}

export default check
