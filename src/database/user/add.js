import isElectron from 'is-electron'

import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.User
 * @param {Object} user User { email, password }
 * @returns {Object} User { alreadyExists: true } || { id, email }
 */
const add = async ({ email, password }) => {
  // Check email
  const existing = await query(
    'SELECT id FROM ' + tables.USERS + ' WHERE email = $1',
    [email]
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
    [email, password, false, Date.now(), false, isElectron() ? ['local'] : []]
  )

  const user = response.rows[0]
  user && (user.email = email)

  return user
}

export default add
