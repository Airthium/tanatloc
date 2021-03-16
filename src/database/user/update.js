import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:database/user
 * @param {Object} user User { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (user, data) => {
  return updater(databases.USERS, user.id, data)
}

export default update
