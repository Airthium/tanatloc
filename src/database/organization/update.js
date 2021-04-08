import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof module:database/organization
 * @param {Object} organization Organization { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (organization, data) => {
  return updater(tables.ORGANIZATIONS, organization.id, data)
}

export default update
