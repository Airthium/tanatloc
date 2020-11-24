import Caller from '../call'

/**
 * Check an user
 * @memberof module:src/api/user
 * @param {Object} data Data { username, password }
 */
const check = async ({ username, password }) => {
  return Caller.call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}

export default check
