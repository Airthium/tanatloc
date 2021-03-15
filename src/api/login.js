import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Login
 * @memberof module:api
 * @param {Object} user User { email, password }
 */
const login = async ({ email, password }) => {
  const response = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (response.status === 200) {
    return response.json()
  }

  return response
}

export default login
