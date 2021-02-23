import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update system items
 * @memberof module:src/database/system
 * @param {Object} data Data [{ key, value }, ...]
 */
const update = async (data) => {
  return updater(databases.SYSTEM, null, data)
}

export default update
