import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.User
 * @param {Object} user User { id }
 */
const del = async (user) => {
  await deleter(tables.USERS, user.id)
}

export default del
