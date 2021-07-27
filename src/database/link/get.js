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

  return response.rows[0]
}

export default get
