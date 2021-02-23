import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete group
 * @memberof module:src/database/group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  await deleter(databases.GROUPS, group.id)
}

export default del
