import query from '..'
import { databases } from '@/config/db'

/**
 * Add
 * @memberof module:src/database/user
 * @param {Object} user User { email, password }
 */
const add = async ({ email, password }) => {
  // Check email
  const existing = await query(
    'SELECT id FROM ' + databases.USERS + ' WHERE email = $1',
    [email]
  )
  if (existing.rows.length)
    return {
      alreadyExists: true
    }

  // Create user
  const response = await query(
    'INSERT INTO ' +
      databases.USERS +
      " (email, password, isvalidated, lastmodificationdate, superuser) VALUES ($1, crypt($2, gen_salt('bf')), $3, to_timestamp($4), $5) returning id",
    [email, password, true, Date.now(), false]
  )

  const user = response.rows[0]

  return user
}

export default add
