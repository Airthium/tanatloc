import isElectron from 'is-electron'

import { tables } from '@/config/db'

import query from '..'

type NewUser = {
  alreadyExists?: boolean
  id?: string
  email?: string
}

/**
 * Add
 * @memberof Database.User
 * @param {Object} user User `{ email, password }`
 * @returns {Object} User `{ alreadyExists: true } || { id, email }`
 */
export const add = async (user: {
  email: string
  password: string
}): Promise<NewUser> => {
  // Check email
  const existing = await query(
    'SELECT id FROM ' + tables.USERS + ' WHERE email = $1',
    [user.email]
  )
  if (existing.rows.length)
    return {
      alreadyExists: true
    }

  // Create user
  const response = await query(
    'INSERT INTO ' +
      tables.USERS +
      " (email, password, isvalidated, lastmodificationdate, superuser, authorizedplugins) VALUES ($1, crypt($2, gen_salt('bf')), $3, to_timestamp($4), $5, $6) returning id",
    [
      user.email,
      user.password,
      false,
      Date.now(),
      false,
      isElectron() ? ['local'] : []
    ]
  )

  const newUser = response.rows[0]
  newUser && (newUser.email = user.email)

  return newUser
}
