import query from '..'
import { databases } from '../../../config/db'

/**
 * Get by username
 * @memberof module:src/database/user
 * @param {string} username Username
 * @returns {Object} User
 */
const getByUsername = async (username) => {
  const response = await query(
    'SELECT id FROM ' + databases.USERS + ' WHERE email = $1',
    [username]
  )

  const result = response.rows[0]
  const user = {
    ...result,
    username
  }
  return user
}

export default getByUsername
