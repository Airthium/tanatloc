import { updater } from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/user
 * @param {Object} param0 { user: { id }, data: [{ type: type, method: method, key: key, value: value }] }
 */
const update = async ({ user, data }) => {
  await Promise.all(
    data.map(async (d) => {
      return await updater(databases.USERS, user.id, d)
    })
  )
}

export default update
