import { call } from '@/api/call'

/**
 * Check
 * @memberof API.User
 * @param {Object} data Data `{ email, password }`
 * @returns {Object} User `{ valid: true/false }`
 */
const check = async ({ email, password }) => {
  return call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
}

export default check
