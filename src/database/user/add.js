import isElectron from 'is-electron'

import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof module:database/user
 * @param {Object} user User { email, password }
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

  return response.rows[0]
}

export default add
