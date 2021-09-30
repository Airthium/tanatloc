import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Group
 * @param {Object} group Group { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (group, data) => {
  await updater(tables.GROUPS, group.id, data)
}

export default update
