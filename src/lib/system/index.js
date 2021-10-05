/** @namespace Lib.System */

import SystemDB from '@/database/system'

/**
 * Get items
 * @memberof Lib.System
 * @params {Array} items Items
 * @returns {Object} System `{ ...items }`
 */
const get = async (items) => {
  return SystemDB.get(items)
}

/**
 * Update items
 * @memberof Lib.System
 * @params {Array} items Items
 */
const update = async (items) => {
  await SystemDB.update(items)
}

const System = { get, update }
export default System
