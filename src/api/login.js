import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Login
 * @memberof module:src/api
 * @param {Object} user User { username, password }
 */
const login = async ({ username, password }) => {
  const response = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (response.status === 200) {
    return response.json()
  }

  return response
}

export default login
