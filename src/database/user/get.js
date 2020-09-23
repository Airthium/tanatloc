import { getter } from '..'
import { databases } from '../../../config/db'

/**
 * Get user
 * @memberof module:src/database/user
 * @param {string} id Id (or key value)
 * @param {string} key Key (override id selector)
 */
const get = async (id, data, key = 'id') => {
  const response = await getter(databases.USERS, id, data, key)

  const user = response.rows[0]

  user && (user.username = user.email) // TODO to replace
  user && (user[key] = id)

  return user
}

export default get
