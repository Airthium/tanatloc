import Caller from '@/api/call'

/**
 * Check
 * @memberof API.User
 * @param {Object} data Data `{ email, password }`
 * @returns {Object} User `{ valid: true/false }`
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
