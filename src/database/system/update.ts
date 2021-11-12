import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update items
 * @memberof Database.System
 * @param {Object} data Data `[{ key, value }, ...]`
 */
const update = async (data) => {
  await updater(tables.SYSTEM, 0, data)
}

export default update
