import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  await deleter(tables.GROUPS, group.id)
}

export default del
