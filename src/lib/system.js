/** @module src/lib/system */

import SystemDB from '@/database/system'

/**
 * Get items
 * @params {Array} items Items
 */
const get = async (items) => {
  return SystemDB.get(items)
}

/**
 * Update items
 * @params {Array} items Items
 */
const update = async (items) => {
  return SystemDB.update(items)
}

export default { get, update }
