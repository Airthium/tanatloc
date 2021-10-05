import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Link
 * @param {Object} link Link `{ id }`
 */
const del = async (link) => {
  await deleter(tables.LINKS, link.id)
}

export default del
