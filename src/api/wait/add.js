import Caller from '@/api/call'

/**
 * Add user
 * @memberof module:api/wait
 * @param {Object} user User
 */
const add = async (user) => {
  return Caller.call('/api/wait', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })
}

export default add
