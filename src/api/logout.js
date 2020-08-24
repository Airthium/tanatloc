import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Logout
 * @memberof module:src/api
 */
const logout = async () => {
  await fetch(base + '/api/logout')
}

export default logout
