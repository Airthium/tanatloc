import query from '..'
import { databases } from '../../../config/db'

/**
 * Login
 * @memberof module:src/database/user
 * @param {Object} user User { username, password }
 * @returns {Object} User
 */
const login = async ({ username, password }) => {
  const response = await query(
    'SELECT id FROM ' +
      databases.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [username, password]
  )

  const result = response.rows[0]
  if (!result) return null

  const user = {
    ...result,
    username: username
  }
  return user
}

export default login
