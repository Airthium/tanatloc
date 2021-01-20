import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:src/database/user
 * @param {Object} user User { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (user, data) => {
  await Promise.all(
    data.map(async (d) => {
      return await updater(databases.USERS, user.id, d)
    })
  )
}

export default update
