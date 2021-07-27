import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof module:database/link
 * @param {Object} link Link { id }
 */
const del = async (link) => {
  await deleter(tables.LINKS, link.id)
}

export default del
