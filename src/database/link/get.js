import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof module:database/link
 * @param {string} id Link's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(tables.LINKS, id, data)

  const link = response.rows[0]
  link && (link.id = id)

  return link
}

export default get
