import { deleter } from '..'
import { databases } from '../../../config/db'

/**
 * Delete user
 * @memberof module:src/database/user
 * @param {Object} user User { id }
 */
const del = async (user) => {
  await deleter(databases.USERS, user.id)
}

export default del
