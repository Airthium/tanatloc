import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete group
 * @memberof module:database/group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  await deleter(tables.GROUPS, group.id)
}

export default del
