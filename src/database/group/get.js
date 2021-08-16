import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get user
 * @memberof module:database/group
 * @param {string} id Group's id (or key)
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]

  group && (group.id = id)

  return group
}

export default get
