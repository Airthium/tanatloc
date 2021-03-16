import Caller from '@/api/call'

/**
 * Check an user
 * @memberof module:api/user
 * @param {Object} data Data { email, password }
 */
const check = async ({ email, password }) => {
  return Caller.call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
}

export default check
