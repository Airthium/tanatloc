import { call } from '../call'

/**
 * Add user
 * @memberof module:src/api/user
 * @param {Object} user User
 */
const add = async (user) => {
  return call('/api/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })
}

export default add
