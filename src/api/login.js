import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Login
 * @memberof module:src/api
 * @param {Object} user User { username, password }
 * @returns {?Object} User
 */
const login = async ({ username, password }) => {
  const res = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (res.status === 200) {
    const user = await res.json()
    return user
  } else {
    return null
  }
}

export default login
