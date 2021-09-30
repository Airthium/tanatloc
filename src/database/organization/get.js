import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Organization
 * @param {string} id Organization's id
 * @param {Array} data Data
 * @returns {Object} Organization { id, ...data }
 */
const get = async (id, data) => {
  const response = await getter(tables.ORGANIZATIONS, id, data)

  const organization = response.rows[0]
  organization && (organization.id = id)

  return organization
}

export default get
