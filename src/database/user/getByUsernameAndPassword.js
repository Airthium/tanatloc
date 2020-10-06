import query from '..'
import { databases } from '../../../config/db'

/**
 * Get by username and password
 * @memberof module:src/database/user
 * @param {Object} user User { username, password }
 */
const getByUsernameAndPassword = async ({ username, password }) => {
  const response = await query(
    'SELECT id FROM ' +
      databases.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [username, password]
  )

  const user = response.rows[0]
  return user
}

export default getByUsernameAndPassword
