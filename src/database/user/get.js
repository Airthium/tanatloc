import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.User
 * @param {string} id User's id (or key)
 * @param {Array} data Data
 * @param {string} [key=id] Key (override id selector)
 * @returns {Object} User `{ [key], ...data }`
 */
const get = async (id, data, key = 'id') => {
  const response = await getter(tables.USERS, id, data, key)

  const user = response.rows[0]
  user && (user[key] = id)

  return user
}

export default get
