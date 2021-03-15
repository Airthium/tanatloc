import { getter } from '..'
import { databases } from '@/config/db'

/**
 * Get
 * @memberof module:database/organization
 * @param {string} id Organization's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.ORGANIZATIONS, id, data)

  return response.rows[0]
}

export default get
