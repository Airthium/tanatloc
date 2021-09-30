import query from '..'
import { tables } from '@/config/db'

/**
 * Get by email and password
 * @memberof Database.User
 * @param {Object} user User { email, password }
 * @returns {Object} User { id }
 */
const getByUsernameAndPassword = async ({ email, password }) => {
  const response = await query(
    'SELECT id, isvalidated FROM ' +
      tables.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [email, password]
  )

  return response.rows[0]
}

export default getByUsernameAndPassword
