import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:database/group
 * @param {Object} group Group { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (group, data) => {
  return updater(databases.GROUPS, group.id, data)
}

export default update
