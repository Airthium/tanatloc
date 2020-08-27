import { getter } from '..'
import { databases } from '../../../config/db'

/**
 *
 * @param {string} id Id (or key value)
 * @param {string} key Key (override id selector)
 */
const get = async (id, data, key = 'id') => {
  const response = await getter(databases.USERS, id, data, key)

  const user = response.rows[0]

  user.username = user.email
  delete user.email

  user[key] = id

  return user
}

export default get
