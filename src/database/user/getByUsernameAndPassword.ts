import { tables } from '@/config/db'

import { query } from '..'
import { IUserCheck } from '../index.d'

/**
 * Get by email and password
 * @memberof Database.User
 * @param {Object} user User `{ email, password }`
 * @returns {Object} User `{ id }`
 */
export const getByUsernameAndPassword = async (user: {
  email: string
  password: string
}): Promise<IUserCheck> => {
  const response = await query(
    'SELECT id, isvalidated FROM ' +
      tables.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [user.email, user.password]
  )

  return response.rows[0]
}
