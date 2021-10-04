import Caller from '@/api/call'

/**
 * Add
 * @memberof API.User
 * @param {Object} user User
 * @returns {Object} User `{ alreadyExists: true } || { id, email }`
 */
const add = async (user) => {
  return Caller.call('/api/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })
}

export default add
