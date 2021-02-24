import { getter } from '..'
import { databases } from '@/config/db'

/**
 * Get user
 * @memberof module:src/database/group
 * @param {string} id Group's id (or key)
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.GROUPS, id, data)

  return response.rows[0]
}

export default get
