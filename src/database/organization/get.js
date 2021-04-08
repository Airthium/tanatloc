import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof module:database/organization
 * @param {string} id Organization's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(tables.ORGANIZATIONS, id, data)

  return response.rows[0]
}

export default get
