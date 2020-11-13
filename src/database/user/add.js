import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/user
 * @param {Object} user User {  }
 */
const add = async ({ username, password }) => {
  // Check email
  const existing = await query(
    'SELECT id FROM ' + databases.USERS + ' WHERE email = $1',
    [username]
  )
  if (existing.rows.length)
    return {
      alreadyExists: true
    }

  // Create user
  const response = await query(
    'INSERT INTO ' +
      databases.USERS +
      " (username, email, password, isvalidated, lastmodificationdate, superuser) VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, to_timestamp($5), $6) returning id",
    [username, username, password, true, Date.now(), false]
  )

  const user = response.rows[0]
  user.username = username

  return user
}

export default add
