import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update system items
 * @memberof module:database/system
 * @param {Object} data Data [{ key, value }, ...]
 */
const update = async (data) => {
  return updater(tables.SYSTEM, 0, data)
}

export default update
