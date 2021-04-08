import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete user
 * @memberof module:database/user
 * @param {Object} user User { id }
 */
const del = async (user) => {
  await deleter(tables.USERS, user.id)
}

export default del
