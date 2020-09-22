import { call } from '../call'

/**
 * Add user
 * @memberof module:src/api/user
 * @param {Object} user User
 */
const add = async (user) => {
  const res = await call('/api/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ user: user })
  })
  return res
}

export default add
