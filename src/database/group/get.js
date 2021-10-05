import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Group
 * @param {string} id Group id
 * @param {Array} data Data
 * @returns {Object} Group `{ id, ...data }`
 */
const get = async (id, data) => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}

export default get
