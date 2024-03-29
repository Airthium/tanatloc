/** @module Database.User.GetByUsernameAndPassword */

import { tables } from '@/config/db'

import { query } from '..'

export interface IUserCheck {
  id: string
  isvalidated: boolean
}

/**
 * Get by email and password
 * @param user User
 * @returns User
 */
export const getByUsernameAndPassword = async (user: {
  email: string
  password: string
}): Promise<IUserCheck | undefined> => {
  const response = await query(
    'SELECT id, isvalidated FROM ' +
      tables.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [user.email, user.password]
  )

  return response.rows[0]
}
