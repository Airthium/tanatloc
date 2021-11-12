import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.User
 * @param {Object} user User `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
const update = async (user, data) => {
  await updater(tables.USERS, user.id, data)
}

export default update
